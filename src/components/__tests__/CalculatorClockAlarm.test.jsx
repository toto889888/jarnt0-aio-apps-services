import { render, screen, fireEvent } from '@testing-library/react';
import CalculatorClockAlarm from '../CalculatorClockAlarm';

describe('CalculatorClockAlarm', () => {
  it('renders the component', () => {
    render(<CalculatorClockAlarm />);
    expect(screen.getByTestId('calc-display')).toBeInTheDocument();
    expect(screen.getByTestId('clock-display')).toBeInTheDocument();
    expect(screen.getByTestId('alarm-input')).toBeInTheDocument();
  });

  it('performs a calculation', () => {
    render(<CalculatorClockAlarm />);
    fireEvent.click(screen.getByTestId('btn-1'));
    fireEvent.click(screen.getByTestId('btn-+'));
    fireEvent.click(screen.getByTestId('btn-2'));
    fireEvent.click(screen.getByTestId('btn-='));
    expect(screen.getByTestId('calc-display')).toHaveTextContent('3');
  });

  it('clears the calculation', () => {
    render(<CalculatorClockAlarm />);
    fireEvent.click(screen.getByTestId('btn-1'));
    fireEvent.click(screen.getByTestId('btn-+'));
    fireEvent.click(screen.getByTestId('btn-2'));
    fireEvent.click(screen.getByTestId('btn-C'));
    expect(screen.getByTestId('calc-display')).toHaveTextContent('0');
  });

  it('deletes the last input', () => {
    render(<CalculatorClockAlarm />);
    fireEvent.click(screen.getByTestId('btn-1'));
    fireEvent.click(screen.getByTestId('btn-+'));
    fireEvent.click(screen.getByTestId('btn-2'));
    fireEvent.click(screen.getByTestId('btn-⌫'));
    expect(screen.getByTestId('calc-display')).toHaveTextContent('1+');
  });

  it('sets an alarm', () => {
    render(<CalculatorClockAlarm />);
    fireEvent.change(screen.getByTestId('alarm-input'), { target: { value: '10:00' } });
    fireEvent.click(screen.getByTestId('set-alarm-btn'));
    expect(screen.getByTestId('alarm-list')).toHaveTextContent('10:00');
  });

  it('deletes an alarm', () => {
    render(<CalculatorClockAlarm />);
    fireEvent.change(screen.getByTestId('alarm-input'), { target: { value: '10:00' } });
    fireEvent.click(screen.getByTestId('set-alarm-btn'));
    expect(screen.getByTestId('alarm-list')).toHaveTextContent('10:00');
    fireEvent.click(screen.getByTestId(/delete-alarm-btn-/));
    expect(screen.queryByText('10:00')).not.toBeInTheDocument();
  });
});