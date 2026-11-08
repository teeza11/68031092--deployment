'use client';

import { useCallback, useEffect, useState } from 'react';

const formatDisplay = (value) => {
  const text = String(value);
  if (text === 'Error' || text.includes('e')) return text;
  const [integer, decimal] = text.split('.');
  const formattedInteger = integer.replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
  return decimal !== undefined ? `${formattedInteger}.${decimal}` : formattedInteger;
};

export default function App() {
  const [display, setDisplay] = useState('0');
  const [storedValue, setStoredValue] = useState(null);
  const [operator, setOperator] = useState(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [hasResult, setHasResult] = useState(false);

  const clear = useCallback(() => {
    setDisplay('0');
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(false);
    setHasResult(false);
  }, []);

  const inputNumber = useCallback((num) => {
    setDisplay((current) => {
      if (waitingForOperand || hasResult) {
        setWaitingForOperand(false);
        setHasResult(false);
        return String(num);
      }
      if (current.replace('-', '').replace('.', '').length >= 9) return current;
      return current === '0' ? String(num) : current + String(num);
    });
  }, [waitingForOperand, hasResult]);

  const inputDecimal = useCallback(() => {
    setDisplay((current) => {
      if (waitingForOperand || hasResult) {
        setWaitingForOperand(false);
        setHasResult(false);
        return '0.';
      }
      return current.includes('.') ? current : `${current}.`;
    });
  }, [waitingForOperand, hasResult]);

  const calculate = (a, b, op) => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const chooseOperator = useCallback((op) => {
    const current = Number(display);
    if (!Number.isFinite(current)) return clear();
    if (operator && !waitingForOperand) {
      const result = calculate(storedValue, current, operator);
      if (!Number.isFinite(result)) {
        setDisplay('Error');
        setStoredValue(null);
        setOperator(null);
        setWaitingForOperand(true);
        return;
      }
      setDisplay(String(Number(result.toPrecision(10))));
      setStoredValue(result);
    } else {
      setStoredValue(current);
    }
    setOperator(op);
    setWaitingForOperand(true);
    setHasResult(false);
  }, [display, operator, waitingForOperand, storedValue, clear]);

  const equals = useCallback(() => {
    if (!operator || storedValue === null || waitingForOperand) return;
    const result = calculate(storedValue, Number(display), operator);
    if (!Number.isFinite(result)) {
      setDisplay('Error');
    } else {
      setDisplay(String(Number(result.toPrecision(10))));
    }
    setStoredValue(null);
    setOperator(null);
    setWaitingForOperand(true);
    setHasResult(true);
  }, [display, operator, storedValue, waitingForOperand]);

  const unary = (kind) => {
    const current = Number(display);
    let result = current;
    if (kind === 'sqrt') result = current < 0 ? NaN : Math.sqrt(current);
    if (kind === 'percent') result = current / 100;
    if (kind === 'reciprocal') result = current === 0 ? NaN : 1 / current;
    if (kind === 'sign') result = -current;
    setDisplay(Number.isFinite(result) ? String(Number(result.toPrecision(10))) : 'Error');
    setWaitingForOperand(true);
    setHasResult(false);
  };

  const memoryAction = (kind) => {
    const current = Number(display);
    if (kind === 'MC') setMemory(0);
    if (kind === 'MR') {
      setDisplay(String(memory));
      setWaitingForOperand(true);
      setHasResult(false);
    }
    if (kind === 'M+') setMemory((value) => value + current);
    if (kind === 'M-') setMemory((value) => value - current);
  };

  // Keyboard events
  useEffect(() => {
    const onKeyDown = (event) => {
      if (/^[0-9]$/.test(event.key)) inputNumber(Number(event.key));
      else if (event.key === '.') inputDecimal();
      else if (event.key === '+') chooseOperator('+');
      else if (event.key === '-') chooseOperator('-');
      else if (event.key === '*') chooseOperator('×');
      else if (event.key === '/') { event.preventDefault(); chooseOperator('÷'); }
      else if (event.key === 'Enter' || event.key === '=') equals();
      else if (event.key === 'Escape' || event.key === 'Delete') clear();
      else if (event.key === 'Backspace') setDisplay((value) => value.length > 1 ? value.slice(0, -1) : '0');
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [inputNumber, inputDecimal, chooseOperator, equals, clear]);

  return (
    <main className="calculator-body">
      <section className="calculator" aria-label="เครื่องคิดเลข">
        <div className="outer">
          <div className="inner">
            <div className="screen" aria-live="polite">{formatDisplay(display)}</div>
            <div className="btn-row">
              {['MC', 'MR', 'M+', 'M-'].map((label) => (
                <button className="green" key={label} onClick={() => memoryAction(label)}>{label}</button>
              ))}
              <button className="red" onClick={clear}>CE</button>
            </div>
            <div className="btn-row">
              {[7, 8, 9].map((n) => <button className="purple" key={n} onClick={() => inputNumber(n)}>{n}</button>)}
              <button className="green" onClick={() => chooseOperator('÷')}>÷</button>
              <button className="green" onClick={() => unary('sqrt')}>√</button>
            </div>
            <div className="btn-row">
              {[4, 5, 6].map((n) => <button className="purple" key={n} onClick={() => inputNumber(n)}>{n}</button>)}
              <button className="green" onClick={() => chooseOperator('×')}>×</button>
              <button className="green" onClick={() => unary('percent')}>%</button>
            </div>
            <div className="btn-row">
              {[1, 2, 3].map((n) => <button className="purple" key={n} onClick={() => inputNumber(n)}>{n}</button>)}
              <button className="green" onClick={() => chooseOperator('-')}>−</button>
              <button className="green" onClick={() => unary('reciprocal')}>1/x</button>
            </div>
            <div className="btn-row">
              <button className="purple" onClick={() => inputNumber(0)}>0</button>
              <button className="purple" onClick={inputDecimal}>.</button>
              <button className="purple" onClick={() => unary('sign')}>±</button>
              <button className="green" onClick={() => chooseOperator('+')}>+</button>
              <button className="green" onClick={equals}>=</button>
            </div>
          </div>
          <div className="student">68031092 ธนโชติ แก้วชูฟอง</div>
        </div>
      </section>
    </main>
  );
}