// orient the validator to the schema
function validator(options) {
    var formElement = document.querySelector(options.form);
    // console.log(options.rules);
    
    var selectorRules = {};

    function validate(inputElement, rule) {
        var errorMessage = rule.test(inputElement.value);
        var errorElement = inputElement.parentElement.querySelector(".form-message");

        var rules = selectorRules[rule.selector];

        for(var i = 0; i < rules.length; i++) {
            if(rules[i] === rule) {
                break;
            }
        }
                    if(errorMessage){
                        errorElement.innerHTML = errorMessage;
                        // errorElement.style = 'color: #EA2027';
                        inputElement.parentElement.classList.add("invalid");
                        
                    }else{
                        errorElement.innerHTML = '';
                        inputElement.parentElement.classList.remove("invalid");
                    }

        return  !errorMessage;
    }
    var formElement = document.querySelector(options.form);
    


    if(formElement) {
        formElement.onsubmit = function(event) {
            event.preventDefault();

            var isFormValid = true;
            var inputElements = formElement.querySelectorAll("input");
            for(var i = 0; i < inputElements.length; i++) {
                var inputElement = inputElements[i];
                var rules = selectorRules[inputElement.name];
                if(rules) {
                    for(var j = 0; j < rules.length; j++) {
                        var isValidate = validate(inputElement, rules[j]);
                        if(isValidate) {
                            isFormValid = false;
                        }
                    }
                }
            }

            if(isFormValid) {
                if(typeof options.onSubmit === "function") {

                    var enableInputs = formElement.querySelectorAll('[name]: not([disabled])');
                    console.log(enableInputs);
                    options.onSubmit({
                        form: formElement,
                        data: {
                            [enableInputs.name]: enableInputs.value
                        }
                    });
                }
            }
        }
        
        
        
        // lặp qua mỗi rule và xử lí lắng nghe event(blur, input)
        options.rules.forEach(function(rule) {

            // lưu lại các rule cho mỗi input

            if(Array.isArray(selectorRules[rule.selector])) {
                selectorRules[rule.selector].push(rule.test);
            
            }else{
                selectorRules[rule.selector] = [rule];
            }
            // selectorRules[rule.selector] = rule;

            var inputElement = formElement.querySelector(rule.selector);

            if(inputElement){
                // xử lí blur ra khỏi input
                inputElement.onblur = function (){
                   validate(inputElement, rule);
                }
                // xử lí focus vào input
                inputElement.onfocus = function (){
                    var errorElement = inputElement.parentElement.querySelector(".form-message");
                    errorElement.innerHTML = '';
                    inputElement.parentElement.classList.remove("invalid");
                }
            }
        
        }
        );
        // console.log(selectorRules);
    }
}

// rule identifier
// Nguyên tắc của rule
// nếu khi có lỗi => mess lỗi
// nếu khi ko có lỗi => không trả ra gì cả
validator.isRequired = function(selector, message) {
    return{
        selector: selector,
        test: function(value) {
            return value.trim() ? undefined :message || "This field is required";
        }
    };
}

validator.isEmail = function(selector,message) {
    return{
        selector: selector,
        test: function(value) {
            var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
            return regex.test(value) ? undefined :message || "Email is required"
        }
    };
}

validator.minLength = function(selector, min,message) {
    return{
        selector: selector,
        test: function(value) {
            return value.length >= min ? undefined :message || "This field must be at least " + min + " characters long";
        }
    };
}


validator.isConfirmed = function(selector, getConfirmValue, message) {
    return{
        selector: selector,
        test: function(value) {
            var confirmValue = getConfirmValue();
            return value === confirmValue ? undefined : message || "Values do not match";
        }
    };
}

