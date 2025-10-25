// GuideFloat Field Detector - Intelligent form field detection for any website

if (typeof window.FieldDetector !== 'undefined') {
    console.log('[FieldDetector] Already loaded, skipping...');
} else {
    const FieldDetector = {
        
        // Detect all form fields on the page and categorize them
        detectFormFields: function(formElement = null) {
            const targetForm = formElement || document.querySelector('form') || document;
            const fields = [];
            
            // Get all input, select, and textarea elements
            const elements = targetForm.querySelectorAll('input, select, textarea');
            
            elements.forEach((element, index) => {
                const fieldInfo = this.analyzeField(element, index);
                if (fieldInfo) {
                    fields.push(fieldInfo);
                }
            });
            
            // Sort fields by logical order (position, tabindex, etc.)
            return this.sortFieldsByOrder(fields);
        },
        
        // Analyze a single field to determine its type and purpose
        analyzeField: function(element, index) {
            const field = {
                element: element,
                index: index,
                type: element.type || element.tagName.toLowerCase(),
                name: element.name || element.id || `field_${index}`,
                selector: this.createElementSelector(element),
                autocomplete: element.getAttribute('autocomplete'),
                placeholder: element.placeholder,
                label: this.findFieldLabel(element),
                required: element.required || element.hasAttribute('required'),
                visible: this.isElementVisible(element),
                order: this.getFieldOrder(element)
            };
            
            // Determine field purpose and progression order
            field.purpose = this.detectFieldPurpose(field);
            field.progressionOrder = this.getProgressionOrder(field);
            
            return field;
        },
        
        // Detect the purpose of a field based on various attributes
        detectFieldPurpose: function(field) {
            const { element, type, name, autocomplete, placeholder, label } = field;
            
            // Check autocomplete attribute first (most reliable)
            if (autocomplete) {
                const purposeMap = {
                    'email': 'email',
                    'username': 'username',
                    'current-password': 'current-password',
                    'new-password': 'new-password',
                    'given-name': 'first-name',
                    'family-name': 'last-name',
                    'full-name': 'full-name',
                    'organization': 'company',
                    'tel': 'phone',
                    'url': 'website',
                    'address-line1': 'address',
                    'postal-code': 'zipcode',
                    'country': 'country',
                    'bday': 'birthday'
                };
                
                if (purposeMap[autocomplete]) {
                    return purposeMap[autocomplete];
                }
            }
            
            // Check name attribute patterns
            const nameLower = name.toLowerCase();
            if (nameLower.includes('email') || nameLower.includes('e-mail')) return 'email';
            if (nameLower.includes('password') || nameLower.includes('pass')) return 'password';
            if (nameLower.includes('first') || nameLower.includes('fname')) return 'first-name';
            if (nameLower.includes('last') || nameLower.includes('lname') || nameLower.includes('surname')) return 'last-name';
            if (nameLower.includes('company') || nameLower.includes('organization')) return 'company';
            if (nameLower.includes('phone') || nameLower.includes('tel') || nameLower.includes('mobile')) return 'phone';
            if (nameLower.includes('address') || nameLower.includes('street')) return 'address';
            if (nameLower.includes('zip') || nameLower.includes('postal')) return 'zipcode';
            if (nameLower.includes('country') || nameLower.includes('nation')) return 'country';
            
            // Check placeholder text
            if (placeholder) {
                const placeholderLower = placeholder.toLowerCase();
                if (placeholderLower.includes('email') || placeholderLower.includes('@')) return 'email';
                if (placeholderLower.includes('password') || placeholderLower.includes('pass')) return 'password';
                if (placeholderLower.includes('first name') || placeholderLower.includes('given name')) return 'first-name';
                if (placeholderLower.includes('last name') || placeholderLower.includes('family name')) return 'last-name';
                if (placeholderLower.includes('company') || placeholderLower.includes('organization')) return 'company';
                if (placeholderLower.includes('phone') || placeholderLower.includes('tel')) return 'phone';
            }
            
            // Check label text
            if (label) {
                const labelLower = label.toLowerCase();
                if (labelLower.includes('email') || labelLower.includes('e-mail')) return 'email';
                if (labelLower.includes('password') || labelLower.includes('pass')) return 'password';
                if (labelLower.includes('first name') || labelLower.includes('given name')) return 'first-name';
                if (labelLower.includes('last name') || labelLower.includes('family name')) return 'last-name';
                if (labelLower.includes('company') || labelLower.includes('organization')) return 'company';
                if (labelLower.includes('phone') || labelLower.includes('tel')) return 'phone';
            }
            
            // Check input type
            if (type === 'email') return 'email';
            if (type === 'password') return 'password';
            if (type === 'tel') return 'phone';
            if (type === 'url') return 'website';
            if (type === 'checkbox') return 'checkbox';
            if (type === 'radio') return 'radio';
            if (type === 'submit' || type === 'button') return 'submit';
            
            // Default fallback
            return 'text';
        },
        
        // Get logical progression order for fields
        getProgressionOrder: function(field) {
            const orderMap = {
                'email': 1,
                'username': 1,
                'first-name': 2,
                'last-name': 3,
                'full-name': 2,
                'company': 4,
                'phone': 5,
                'address': 6,
                'zipcode': 7,
                'country': 8,
                'password': 9,
                'new-password': 9,
                'current-password': 9,
                'checkbox': 10,
                'radio': 10,
                'submit': 99,
                'text': 50
            };
            
            return orderMap[field.purpose] || 50;
        },
        
        // Find the label associated with a field
        findFieldLabel: function(element) {
            // Check for explicit label association
            if (element.id) {
                const label = document.querySelector(`label[for="${element.id}"]`);
                if (label) return label.textContent.trim();
            }
            
            // Check for parent label
            const parentLabel = element.closest('label');
            if (parentLabel) {
                return parentLabel.textContent.replace(element.value || '', '').trim();
            }
            
            // Check for nearby text (common patterns)
            const parent = element.parentElement;
            if (parent) {
                const textNodes = Array.from(parent.childNodes)
                    .filter(node => node.nodeType === Node.TEXT_NODE)
                    .map(node => node.textContent.trim())
                    .filter(text => text.length > 0);
                
                if (textNodes.length > 0) {
                    return textNodes[0];
                }
            }
            
            return null;
        },
        
        // Check if element is visible
        isElementVisible: function(element) {
            const style = window.getComputedStyle(element);
            return style.display !== 'none' && 
                   style.visibility !== 'hidden' && 
                   style.opacity !== '0' &&
                   element.offsetWidth > 0 && 
                   element.offsetHeight > 0;
        },
        
        // Get field order (position, tabindex, etc.)
        getFieldOrder: function(element) {
            const rect = element.getBoundingClientRect();
            const tabIndex = parseInt(element.getAttribute('tabindex')) || 0;
            
            return {
                tabIndex: tabIndex,
                top: rect.top,
                left: rect.left,
                position: rect.top * 1000 + rect.left // Simple position-based ordering
            };
        },
        
        // Sort fields by logical order
        sortFieldsByOrder: function(fields) {
            return fields
                .filter(field => field.visible) // Only include visible fields
                .sort((a, b) => {
                    // First by progression order
                    if (a.progressionOrder !== b.progressionOrder) {
                        return a.progressionOrder - b.progressionOrder;
                    }
                    
                    // Then by tabindex
                    if (a.order.tabIndex !== b.order.tabIndex) {
                        return a.order.tabIndex - b.order.tabIndex;
                    }
                    
                    // Finally by position
                    return a.order.position - b.order.position;
                });
        },
        
        // Create a unique CSS selector for an element
        createElementSelector: function(element) {
            if (element.id) {
                return `#${element.id}`;
            }
            
            if (element.name) {
                return `[name="${element.name}"]`;
            }
            
            // Create selector based on attributes
            const tag = element.tagName.toLowerCase();
            const type = element.type ? `[type="${element.type}"]` : '';
            const name = element.name ? `[name="${element.name}"]` : '';
            const placeholder = element.placeholder ? `[placeholder="${element.placeholder}"]` : '';
            
            return `${tag}${type}${name}${placeholder}`;
        },
        
        // Generate field progression configuration for a form
        generateFieldProgression: function(formElement = null) {
            const fields = this.detectFormFields(formElement);
            
            return {
                enabled: true,
                fields: fields.map(field => ({
                    selector: field.selector,
                    message: this.generateFieldMessage(field),
                    required: field.required,
                    purpose: field.purpose,
                    autocomplete: field.autocomplete
                }))
            };
        },
        
        // Generate appropriate message for a field
        generateFieldMessage: function(field) {
            const messageMap = {
                'email': 'Enter your email address',
                'username': 'Enter your username',
                'first-name': 'Enter your first name',
                'last-name': 'Enter your last name',
                'full-name': 'Enter your full name',
                'company': 'Enter your company name',
                'phone': 'Enter your phone number',
                'address': 'Enter your address',
                'zipcode': 'Enter your postal code',
                'country': 'Select your country',
                'password': 'Enter your password',
                'new-password': 'Create a secure password',
                'current-password': 'Enter your current password',
                'checkbox': 'Check this option',
                'radio': 'Select this option',
                'submit': 'Click to submit the form',
                'text': 'Fill in this field'
            };
            
            return messageMap[field.purpose] || `Complete the ${field.label || 'field'}`;
        }
    };
    
    // Make available globally
    window.FieldDetector = FieldDetector;
    console.log('[FieldDetector] Field detection system loaded');
}
