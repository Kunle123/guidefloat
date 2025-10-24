#!/usr/bin/env node

/**
 * GuideFloat JSON Guide Validator
 * 
 * Usage: node validate-guide.js path/to/guide.json
 * 
 * This script validates that a guide JSON file has all required properties
 * and follows the correct format for GuideFloat guides.
 */

const fs = require('fs');
const path = require('path');

// Required root properties
const REQUIRED_ROOT_PROPERTIES = [
    'id', 'title', 'description', 'category', 'difficulty', 
    'estimatedTime', 'totalSteps', 'steps'
];

// Required step properties
const REQUIRED_STEP_PROPERTIES = [
    'id', 'title', 'description', 'instructions', 'estimatedTime'
];

// Valid difficulty levels
const VALID_DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

// Valid spotlight types
const VALID_SPOTLIGHT_TYPES = ['success', 'info', 'warning', 'error'];

// Valid spotlight positions
const VALID_SPOTLIGHT_POSITIONS = ['auto', 'top', 'bottom', 'left', 'right'];

// Valid button types
const VALID_BUTTON_TYPES = ['affiliate', 'regular'];

function validateGuide(filePath) {
    console.log(`🔍 Validating guide: ${filePath}`);
    console.log('=' .repeat(50));
    
    let errors = [];
    let warnings = [];
    
    try {
        // Read and parse JSON
        const content = fs.readFileSync(filePath, 'utf8');
        const guide = JSON.parse(content);
        
        // Validate root properties
        console.log('📋 Checking root properties...');
        REQUIRED_ROOT_PROPERTIES.forEach(prop => {
            if (!(prop in guide)) {
                errors.push(`Missing required root property: ${prop}`);
            }
        });
        
        // Validate difficulty
        if (guide.difficulty && !VALID_DIFFICULTIES.includes(guide.difficulty)) {
            errors.push(`Invalid difficulty: ${guide.difficulty}. Must be one of: ${VALID_DIFFICULTIES.join(', ')}`);
        }
        
        // Validate totalSteps matches actual steps
        if (guide.steps && guide.totalSteps !== guide.steps.length) {
            warnings.push(`totalSteps (${guide.totalSteps}) doesn't match actual steps count (${guide.steps.length})`);
        }
        
        // Validate steps
        if (guide.steps && Array.isArray(guide.steps)) {
            console.log('📝 Checking steps...');
            guide.steps.forEach((step, index) => {
                const stepNum = index + 1;
                
                // Check required step properties
                REQUIRED_STEP_PROPERTIES.forEach(prop => {
                    if (!(prop in step)) {
                        errors.push(`Step ${stepNum}: Missing required property: ${prop}`);
                    }
                });
                
                // Check step ID matches position
                if (step.id !== stepNum) {
                    warnings.push(`Step ${stepNum}: ID (${step.id}) doesn't match position (${stepNum})`);
                }
                
                // Validate spotlight if present
                if (step.spotlight) {
                    if (step.spotlight.type && !VALID_SPOTLIGHT_TYPES.includes(step.spotlight.type)) {
                        errors.push(`Step ${stepNum}: Invalid spotlight type: ${step.spotlight.type}`);
                    }
                    if (step.spotlight.position && !VALID_SPOTLIGHT_POSITIONS.includes(step.spotlight.position)) {
                        errors.push(`Step ${stepNum}: Invalid spotlight position: ${step.spotlight.position}`);
                    }
                    if (!step.spotlight.target) {
                        errors.push(`Step ${stepNum}: Spotlight missing target selector`);
                    }
                    if (!step.spotlight.message) {
                        errors.push(`Step ${stepNum}: Spotlight missing message`);
                    }
                }
                
                // Validate action buttons if present
                if (step.actionButtons && Array.isArray(step.actionButtons)) {
                    step.actionButtons.forEach((button, btnIndex) => {
                        if (!button.text) {
                            errors.push(`Step ${stepNum}, Button ${btnIndex + 1}: Missing text`);
                        }
                        if (!button.url) {
                            errors.push(`Step ${stepNum}, Button ${btnIndex + 1}: Missing URL`);
                        }
                        if (button.type && !VALID_BUTTON_TYPES.includes(button.type)) {
                            errors.push(`Step ${stepNum}, Button ${btnIndex + 1}: Invalid type: ${button.type}`);
                        }
                    });
                }
                
                // Validate field progression if present
                if (step.fieldProgression) {
                    if (step.fieldProgression.enabled && step.fieldProgression.fields) {
                        step.fieldProgression.fields.forEach((field, fieldIndex) => {
                            if (!field.selector) {
                                errors.push(`Step ${stepNum}, Field ${fieldIndex + 1}: Missing selector`);
                            }
                            if (!field.message) {
                                errors.push(`Step ${stepNum}, Field ${fieldIndex + 1}: Missing message`);
                            }
                        });
                    }
                }
                
                // Check for common CSS selector issues
                if (step.spotlight && step.spotlight.target) {
                    if (step.spotlight.target.includes(':contains(')) {
                        errors.push(`Step ${stepNum}: Invalid CSS selector (jQuery syntax): ${step.spotlight.target}`);
                    }
                }
            });
        } else {
            errors.push('Steps must be an array');
        }
        
        // Validate prerequisites if present
        if (guide.prerequisites) {
            console.log('📋 Checking prerequisites...');
            if (guide.prerequisites.checkpoints && Array.isArray(guide.prerequisites.checkpoints)) {
                guide.prerequisites.checkpoints.forEach((checkpoint, index) => {
                    if (!checkpoint.id) {
                        errors.push(`Prerequisites checkpoint ${index + 1}: Missing ID`);
                    }
                    if (!checkpoint.question) {
                        errors.push(`Prerequisites checkpoint ${index + 1}: Missing question`);
                    }
                    if (!checkpoint.skipToStep) {
                        errors.push(`Prerequisites checkpoint ${index + 1}: Missing skipToStep`);
                    }
                });
            }
        }
        
    } catch (error) {
        if (error instanceof SyntaxError) {
            errors.push(`Invalid JSON: ${error.message}`);
        } else {
            errors.push(`File error: ${error.message}`);
        }
    }
    
    // Report results
    console.log('\n📊 Validation Results:');
    console.log('=' .repeat(50));
    
    if (errors.length === 0 && warnings.length === 0) {
        console.log('✅ Guide is valid! No errors or warnings found.');
        return true;
    }
    
    if (errors.length > 0) {
        console.log(`❌ ${errors.length} Error(s) found:`);
        errors.forEach(error => console.log(`   • ${error}`));
    }
    
    if (warnings.length > 0) {
        console.log(`⚠️  ${warnings.length} Warning(s) found:`);
        warnings.forEach(warning => console.log(`   • ${warning}`));
    }
    
    console.log('\n💡 Tips:');
    console.log('   • Use valid CSS selectors (no jQuery syntax)');
    console.log('   • Ensure all URLs are working');
    console.log('   • Test selectors on actual pages');
    console.log('   • Use \\n for line breaks in instructions');
    
    return errors.length === 0;
}

// Main execution
if (require.main === module) {
    const filePath = process.argv[2];
    
    if (!filePath) {
        console.log('Usage: node validate-guide.js path/to/guide.json');
        console.log('Example: node validate-guide.js chrome-extension/guides/shopify-store-setup.json');
        process.exit(1);
    }
    
    if (!fs.existsSync(filePath)) {
        console.error(`❌ File not found: ${filePath}`);
        process.exit(1);
    }
    
    const isValid = validateGuide(filePath);
    process.exit(isValid ? 0 : 1);
}

module.exports = { validateGuide };
