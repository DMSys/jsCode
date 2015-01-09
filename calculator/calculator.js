function $Calculator(calculatorId) {
    return new function () {
        this.Show = function() {
            // Главния елемент
            var calculator = document.getElementById(calculatorId);
            if (calculator == null) {
                return;
            }
            var calculatorClassName = calculator.className;
            var displayId = calculatorId + '-display';
            var keyboardId = calculatorId + '-keyboard';

            var displayHtml =
                '<div class="' + calculatorClassName + '-display" id="' + displayId + '">' +
                    '<div class="history" id="' + displayId + '-history"></div>' +
                    '<div class="number" id="' + displayId + '-number"></div>' +
                '</div>';
            var keyboardHtml =
                '<div class="' + calculatorClassName + '-keyboard" id="' + keyboardId + '">';
            // Ред 1
            keyboardHtml += '<div class="ckb-row">';
            keyboardHtml += createFunctionButton(displayId, '&percnt;', '');
            keyboardHtml += createFunctionButton(displayId, '&radic;', 'sqrt');
            keyboardHtml += createFunctionButton(displayId, '&larr;', 'backspace');
            keyboardHtml += createFunctionButton(displayId, 'CE', 'delete');
            keyboardHtml += '</div>';
            // Ред 2
            keyboardHtml += '<div class="ckb-row">';
            keyboardHtml += createNumberButton(displayId, '7');
            keyboardHtml += createNumberButton(displayId, '8');
            keyboardHtml += createNumberButton(displayId, '9');
            keyboardHtml += createFunctionButton(displayId, '&divide;', 'division');
            keyboardHtml += '</div>';
            // Ред 3
            keyboardHtml += '<div class="ckb-row">';
            keyboardHtml += createNumberButton(displayId, '4');
            keyboardHtml += createNumberButton(displayId, '5');
            keyboardHtml += createNumberButton(displayId, '6');
            keyboardHtml += createFunctionButton(displayId, '&times;', 'multiply');
            keyboardHtml += '</div>';
            // Ред 4
            keyboardHtml += '<div class="ckb-row">';
            keyboardHtml += createNumberButton(displayId, '1');
            keyboardHtml += createNumberButton(displayId, '2');
            keyboardHtml += createNumberButton(displayId, '3');
            keyboardHtml += createFunctionButton(displayId, '&minus;', 'minus');
            keyboardHtml += '</div>';
            // Ред 5
            keyboardHtml += '<div class="ckb-row">';
            keyboardHtml += createNumberButton(displayId, '0');
            keyboardHtml += createNumberButton(displayId, '&period;');
            keyboardHtml += createOperationButton(displayId);
            keyboardHtml += createFunctionButton(displayId, '&plus;', 'plus');
            keyboardHtml += '</div>';
            keyboardHtml += '</div>';

            calculator.innerHTML = displayHtml + keyboardHtml;
        }
    }

    function createNumberButton(displayId, value) {
        return '<div class="btn"><div class="btn-light" onclick="setCalculatorDisplayNumber(\'' + displayId + '\',\'' + value + '\')"><p class="btn-text">' + value + '</p></div></div>';
    }
    function createFunctionButton(displayId, value, command) {
        return '<div class="btn"><div class="btn-gray" onclick="executeCalculatorFunction(\'' + displayId + '\',\'' + command + '\')"><p class="btn-text">' + value + '</p></div></div>';
    }
    function createOperationButton(displayId) {
        return '<div class="btn"><div class="btn-blue" onclick="executeCalculatorFunction(\'' + displayId + '\',\'equals\')"><p class="btn-text">&equals;</p></div></div>';
    }
}
/* Добавя цифри към числото
*/
function setCalculatorDisplayNumber(elementId, value) {
    var elementDisplay = document.getElementById(elementId + '-number');
    // Команден ред
    var commandLine = elementDisplay.data;
    if ((commandLine == null) || (commandLine == '')) {
        commandLine = '{0}';
    }
    // Влидация при въвеждане на '.'
    if (value == '.') {
        if (commandLine == '{0}') {
            commandLine = '0{0}';
        }
        else if (commandLine.indexOf(value) > -1) {
            return;
        }
    }
    // Добавя въведеното число
    commandLine = commandLine.replace('{0}', value + '{0}');
    // Визоализира
    elementDisplay.data = commandLine;
    elementDisplay.innerHTML = commandLine.replace('{0}', '');
    // console.log(commandLine);
}
/* Изпълнява команда
*/
function executeCalculatorFunction(elementId, command) {
    var elementDisplayNumber = document.getElementById(elementId + '-number');
    var commandLine = elementDisplayNumber.data;
    // Влидира командния ред
    var isEmptyCommand = false;

    if ((commandLine == null) || (commandLine == '') || (commandLine == '{0}')) {
        commandLine = '{0}';
        isEmptyCommand = true;
    }

    // Изчиства екрана
    if (command == 'delete') {
        commandLine = '{0}';
    }
        // Изтрива последния символ
    else if (command == 'backspace') {
        var cursorIndex = commandLine.indexOf('{0}');
        if (cursorIndex <= 1) {
            commandLine = '{0}';
        }
        else if (commandLine[cursorIndex - 1] == '(') {
            var operatorIndex = commandLine.indexOfBefore(' ', cursorIndex - 1);
            if (operatorIndex == -1) {
                commandLine = '{0}';
            }
            else {
                // commandLine = commandLine.substring(0, operatorIndex).rtrim() + '{0}';
                commandLine = commandLine.substring(0, operatorIndex) + '{0}';
            }
        }
        else {
            commandLine = commandLine.substring(0, cursorIndex - 1)
                + commandLine.substring(cursorIndex, commandLine.length);
        }
    }
        // Равно
    else if (command == 'equals') {
        var evalCommandText = commandLine.replace('{0}', '');
        var evalCommand = evalCommandText.replace(' sqrt(', ' Math.sqrt(');
        var evalResult = eval(evalCommand);
        commandLine = evalResult + '{0}';
        // Ако има резултат
        if (evalCommand != evalResult) {
            var elementDisplayHistory = document.getElementById(elementId + '-history');
            elementDisplayHistory.innerHTML +=
                '<div>' + evalCommandText + ' = ' + evalResult + '</div>';
        }
    }
        // Събиране
    else if (command == 'plus') {
        if (isEmptyCommand) {
            return;
        }
        commandLine = commandLine.replace('{0}', ' + {0}');
    }
        // Изваждане
    else if (command == 'minus') {
        if (isEmptyCommand) {
            return;
        }
        commandLine = commandLine.replace('{0}', ' - {0}');
    }
        // Умножение
    else if (command == 'multiply') {
        if (isEmptyCommand) {
            return;
        }
        commandLine = commandLine.replace('{0}', ' * {0}');
    }
        // Деление
    else if (command == 'division') {
        if (isEmptyCommand) {
            return;
        }
        commandLine = commandLine.replace('{0}', ' / {0}');
    }
        // 
    else if (command == 'sqrt') {
        var cursorIndex = commandLine.indexOf('{0}');
        if ((cursorIndex == 0) || (commandLine[cursorIndex - 1] == ' ')) {
            commandLine = commandLine.replace('{0}', 'sqrt({0})');
        }
        else {
            commandLine = commandLine.replace('{0}', ' + sqrt({0})');
        }
    }
    else {
    }
    // Визоализира
    elementDisplayNumber.data = commandLine;
    elementDisplayNumber.innerHTML = commandLine.replace('{0}', '');
}

/*
 * searchValue  - Required. The string to search for
 * start        - Optional. Default 0. At which position to start the search
*/
String.prototype.indexOfBefore = function (searchValue, start) {
    var startSearch = (start == null) ? this.length : start;
    for (var i = startSearch ; i > 0; i--) {
        if (this[i] == searchValue) {
            return i + 1;
        }
    }
    return -1;
}
/* left trim
*/
String.prototype.ltrim = function () {
    return this.replace(/^\s+/, '');
}
/* right trim
*/
String.prototype.rtrim = function () {
    return this.replace(/\s+$/, '');
}
/* right trim
*/
String.prototype.rtrim = function (value) {
    for (var i = this.length ; i > 0; i--) {
        if (this[i] != value) {
            return this.substring(0, i);
        }
    }
}
/* left and right trim
*/
String.prototype.trim = function () {
    return this.ltrim().rtrim();
}