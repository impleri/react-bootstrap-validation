'use strict';

var _get = require('babel-runtime/helpers/get')['default'];

var _inherits = require('babel-runtime/helpers/inherits')['default'];

var _createClass = require('babel-runtime/helpers/create-class')['default'];

var _classCallCheck = require('babel-runtime/helpers/class-call-check')['default'];

var _defineProperty = require('babel-runtime/helpers/define-property')['default'];

var _objectWithoutProperties = require('babel-runtime/helpers/object-without-properties')['default'];

var _extends = require('babel-runtime/helpers/extends')['default'];

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
                    getDefaultValue: this._getDefaultValue.bind(this),
                    hasError: this._hasError.bind(this),
                    register: this.registerInput.bind(this),
                    unregister: this.unregisterInput.bind(this),
                    validate: this._validateInput.bind(this),
                    validationEvent: this.props.validationEvent
                }
            };
        }
    }, {
        key: 'componentWillMount',
        value: function componentWillMount() {
            _get(Object.getPrototypeOf(Form.prototype), 'componentWillMount', this).call(this);

            this._validators = {};
        }
    }, {
        key: 'registerInput',
        value: function registerInput(input) {
            _get(Object.getPrototypeOf(Form.prototype), 'registerInput', this).call(this, input);

            if (typeof input.props.validate === 'string') {
                this._validators[input.props.name] = this._compileValidationRules(input, input.props.validate);
            }
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
            var _props = this.props;
            var children = _props.children;
            var errorHelp = _props.errorHelp;
            var model = _props.model;
            var onValidSubmit = _props.onValidSubmit;
            var onInvalidSubmit = _props.onInvalidSubmit;
            var validateOne = _props.validateOne;
            var validateAll = _props.validateAll;
            var validationEvent = _props.validationEvent;

            var props = _objectWithoutProperties(_props, ['children', 'errorHelp', 'model', 'onValidSubmit', 'onInvalidSubmit', 'validateOne', 'validateAll', 'validationEvent']);

            return _react2['default'].createElement(
                'form',
                _extends({ ref: 'form',
                    onSubmit: this._handleSubmit.bind(this),
                    action: '#'
                }, props),
                this.props.children
            );
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
        key: 'submit',
        value: function submit() {
            this._handleSubmit();
        }
    }, {
        key: '_validateInput',
        value: function _validateInput(name) {
            this._validateOne(name, this.getValues());
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
    }, {
        key: '_validateAll',
        value: function _validateAll(context) {
            var _this2 = this;

            var isValid = true;
            var errors = [];

            if (typeof this.props.validateAll === 'function') {
                (function () {
                    var result = _this2.props.validateAll(context);

                    if (result !== true) {
                        isValid = false;

                        _Object$keys(result).forEach(function (iptName) {
                            errors.push(iptName);

                            _this2._setError(iptName, true, result[iptName]);
                        });
                    }
                })();
            } else {
                _Object$keys(this._inputs).forEach(function (iptName) {
                    if (!_this2._validateOne(iptName, context)) {
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
        key: '_compileValidationRules',
        value: function _compileValidationRules(input, ruleProp) {
            var _this3 = this;

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
                        result = getInputErrorMessage(input, rule.name) || getInputErrorMessage(_this3, rule.name) || false;
                    }
                });

                return result;
            };
        }
    }, {
        key: '_getDefaultValue',
        value: function _getDefaultValue(iptName) {
            if (iptName in this.props.model) {
                return this.props.model[iptName];
            }
        }
    }, {
        key: '_getValue',
        value: function _getValue(iptName) {
            var input = this._inputs[iptName];

            if (Array.isArray(input)) {
                console.warn('Multiple inputs use the same name "' + iptName + '"');

                return false;
            }

            return input.getValue();
        }
    }, {
        key: '_handleSubmit',
        value: function _handleSubmit(e) {
            if (e) {
                e.preventDefault();
            }

            var values = this.getValues();

            var _validateAll2 = this._validateAll(values);

            var isValid = _validateAll2.isValid;
            var errors = _validateAll2.errors;

            if (isValid) {
                this.props.onValidSubmit(values);
            } else {
                this.props.onInvalidSubmit(errors, values);
            }
        }
    }]);

    return Form;
})(_InputContainer3['default']);

exports['default'] = Form;

Form.childContextTypes = {
    Validator: _react2['default'].PropTypes.object.isRequired
};

Form.propTypes = {
    className: _react2['default'].PropTypes.string,
    model: _react2['default'].PropTypes.object,
    onValidSubmit: _react2['default'].PropTypes.func.isRequired,
    onInvalidSubmit: _react2['default'].PropTypes.func,
    validateOne: _react2['default'].PropTypes.func,
    validateAll: _react2['default'].PropTypes.func,
    validationEvent: _react2['default'].PropTypes.oneOf(['onChange', 'onBlur', 'onFocus']),
    errorHelp: _react2['default'].PropTypes.node
};

Form.defaultProps = {
    model: {},
    validationEvent: 'onChange',
    onInvalidSubmit: function onInvalidSubmit() {}
};
module.exports = exports['default'];