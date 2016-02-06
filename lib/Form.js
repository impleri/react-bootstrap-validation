'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _toConsumableArray = require('babel-runtime/helpers/to-consumable-array')['default'];

var _Object$keys = require('babel-runtime/core-js/object/keys')['default'];

var _Object$assign2 = require('babel-runtime/core-js/object/assign')['default'];

var _interopRequireDefault = require('babel-runtime/helpers/interop-require-default')['default'];

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _InputContainer2 = require('./InputContainer');

var _InputContainer3 = _interopRequireDefault(_InputContainer2);

var _ValidatedInput = require('./ValidatedInput');

var _ValidatedInput2 = _interopRequireDefault(_ValidatedInput);

var _RadioGroup = require('./RadioGroup');

var _RadioGroup2 = _interopRequireDefault(_RadioGroup);

var _Validator = require('./Validator');

var _Validator2 = _interopRequireDefault(_Validator);

var _FileValidator = require('./FileValidator');

var _FileValidator2 = _interopRequireDefault(_FileValidator);

function getInputErrorMessage(input, ruleName) {
    var errorHelp = input.props.errorHelp;

    if (typeof errorHelp === 'object') {
        return errorHelp[ruleName];
    } else {
        return errorHelp;
    }
}

var Form = (function (_InputContainer) {
    _inherits(Form, _InputContainer);

    function Form(props) {
        _classCallCheck(this, Form);

        _get(Object.getPrototypeOf(Form.prototype), 'constructor', this).call(this, props);

        this.state = {
            isValid: true,
            invalidInputs: {}
        };
    }

    _createClass(Form, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                Validator: {
                    getValue: this._getValue.bind(this),
                    hasError: this._hasError.bind(this),
                    registerInput: this.registerInput.bind(this),
                    unregisterInput: this.unregisterInput.bind(this),
                    updateInput: this._updateInput.bind(this),
                    validateInput: this._validateInput.bind(this),
                    validationEvent: this.props.validationEvent
                }
            };
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            _get(Object.getPrototypeOf(Form.prototype), 'componentWillMount', this).call(this);

            this._validators = {};
            this._values = {};
        }
    }, {
        key: 'getValues',
        value: function getValues() {
            var _this = this;

            return _Object$keys(this._inputs).reduce(function (values, name) {
                values[name] = _this._getValue(name);

                return values;
            }, {});
        }
    }, {
        key: 'registerInput',
        value: function registerInput(input) {
            _get(Object.getPrototypeOf(Form.prototype), 'registerInput', this).call(this, input);

            if (typeof input.props.validate === 'string') {
                this._validators[input.props.name] = this._compileValidationRules(input, input.props.validate);
                this._values[input.props.name] = this._getValue(input.props.name);
            }
        }
    }, {
        key: 'submit',
        value: function submit() {
            this._handleSubmit();
        }
    }, {
        key: 'unregisterInput',
        value: function unregisterInput(input) {
            _get(Object.getPrototypeOf(Form.prototype), 'unregisterInput', this).call(this, input);

            delete this._validators[input.props.name];
        }
    }, {
        key: 'render',
        value: function render() {
            return _react2['default'].createElement(
                'form',
                { action: '#',
                    className: this.props.className,
                    onSubmit: this._handleSubmit.bind(this) },
                this.props.children
            );
        }
    }, {
        key: '_compileValidationRules',
        value: function _compileValidationRules(input, ruleProp) {
            var _this2 = this;

            var rules = ruleProp.split(',').map(function (rule) {
                var params = rule.split(':');
                var name = params.shift();
                var inverse = name[0] === '!';

                if (inverse) {
                    name = name.substr(1);
                }

                return { name: name, inverse: inverse, params: params };
            });

            var validator = (input.props && input.props.type) === 'file' ? _FileValidator2['default'] : _Validator2['default'];

            return function (val) {
                var result = true;

                rules.forEach(function (rule) {
                    if (typeof validator[rule.name] !== 'function') {
                        throw new Error('Invalid input validation rule "' + rule.name + '"');
                    }

                    var ruleResult = validator[rule.name].apply(validator, [val].concat(_toConsumableArray(rule.params)));

                    if (rule.inverse) {
                        ruleResult = !ruleResult;
                    }

                    if (result === true && ruleResult !== true) {
                        result = getInputErrorMessage(input, rule.name) || getInputErrorMessage(_this2, rule.name) || false;
                    }
                });

                return result;
            };
        }
    }, {
        key: '_getValue',
        value: function _getValue(iptName) {
            var input = this._inputs[iptName],
                value = undefined;

            if (Array.isArray(input)) {
                console.warn('Multiple inputs use the same name "' + iptName + '"');

                return null;
            }

            if (iptName in this.props.model) {
                value = this.props.model[iptName];
            }

            if (this._values[iptName]) {
                value = this._values[iptName];
            }

            return value;
        }
    }, {
        key: '_handleSubmit',
        value: function _handleSubmit(e) {
            if (e) {
                e.preventDefault();
            }

            var _validateAll2 = this._validateAll(this._values);

            var isValid = _validateAll2.isValid;
            var errors = _validateAll2.errors;

            if (isValid) {
                this.props.onValidSubmit(this._values);
            } else {
                this.props.onInvalidSubmit(errors, this._values);
            }
        }
    }, {
        key: '_hasError',
        value: function _hasError(iptName) {
            return this.state.invalidInputs[iptName];
        }
    }, {
        key: '_setError',
        value: function _setError(iptName, isError, errText) {
            if (isError && errText && typeof errText !== 'string' && typeof errText !== 'boolean') {
                errText = errText + '';
            }

            // set value to either bool or error description string
            this.setState({
                invalidInputs: _Object$assign2(this.state.invalidInputs, _defineProperty({}, iptName, isError ? errText || true : false))
            });
        }
    }, {
        key: '_updateInput',
        value: function _updateInput(name, value) {
            this._values[name] = value;
        }
    }, {
        key: '_validateAll',
        value: function _validateAll(context) {
            var _this3 = this;

            var isValid = true;
            var errors = [];

            if (typeof this.props.validateAll === 'function') {
                (function () {
                    var result = _this3.props.validateAll(context);

                    if (result !== true) {
                        isValid = false;

                        _Object$keys(result).forEach(function (iptName) {
                            errors.push(iptName);

                            _this3._setError(iptName, true, result[iptName]);
                        });
                    }
                })();
            } else {
                _Object$keys(this._inputs).forEach(function (iptName) {
                    if (!_this3._validateOne(iptName, context)) {
                        isValid = false;
                        errors.push(iptName);
                    }
                });
            }

            return {
                isValid: isValid,
                errors: errors
            };
        }
    }, {
        key: '_validateInput',
        value: function _validateInput(name) {
            this._validateOne(name, this._values);
        }
    }, {
        key: '_validateOne',
        value: function _validateOne(iptName, context) {
            var input = this._inputs[iptName];

            if (Array.isArray(input)) {
                console.warn('Multiple inputs use the same name "' + iptName + '"');

                return false;
            }

            var value = context[iptName];
            var isValid = true;
            var validate = input.props.validate;
            var result = undefined,
                error = undefined;

            if (typeof this.props.validateOne === 'function') {
                result = this.props.validateOne(iptName, value, context);
            } else if (typeof validate === 'function') {
                result = validate(value, context);
            } else if (typeof validate === 'string') {
                result = this._validators[iptName](value);
            } else {
                result = true;
            }

            // if result is !== true, it is considered an error
            // it can be either bool or string error
            if (result !== true) {
                isValid = false;

                if (typeof result === 'string') {
                    error = result;
                }
            }

            this._setError(iptName, !isValid, error);

            return isValid;
        }
    }]);

    return Form;
})(_InputContainer3['default']);

exports['default'] = Form;

Form.propTypes = {
    className: _react2['default'].PropTypes.string,
    model: _react2['default'].PropTypes.object,
    onValidSubmit: _react2['default'].PropTypes.func.isRequired,
    onInvalidSubmit: _react2['default'].PropTypes.func,
    validateOne: _react2['default'].PropTypes.func,
    validateAll: _react2['default'].PropTypes.func,
    validationEvent: _react2['default'].PropTypes.oneOf(['onChange', 'onBlur', 'onFocus']),
    errorHelp: _react2['default'].PropTypes.oneOfType([_react2['default'].PropTypes.string, _react2['default'].PropTypes.object])
};

Form.defaultProps = {
    model: {},
    validationEvent: 'onChange',
    onInvalidSubmit: function onInvalidSubmit() {}
};

Form.childContextTypes = {
    Validator: _react2['default'].PropTypes.object.isRequired
};
module.exports = exports['default'];