import { AlertMessage } from './alert-message';
import { AlertType } from './alert-type';

describe('AlertMessage', () => {
  it('should create an instance', () => {
    expect(new AlertMessage('', AlertType.Info)).toBeTruthy();
  });
});
