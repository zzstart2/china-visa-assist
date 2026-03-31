import './FormField.css';

export type FieldType = 'text' | 'select' | 'radio' | 'date' | 'checkbox' | 'textarea';

interface Option {
  value: string;
  label: string;
}

export interface FormFieldProps {
  type: FieldType;
  name: string;
  label?: string;
  value?: string | string[] | boolean;
  options?: Option[];
  placeholder?: string;
  required?: boolean;
  onChange?: (value: string | string[] | boolean) => void;
  disabled?: boolean;
}

function FormField({
  type,
  name,
  label,
  value,
  options = [],
  placeholder,
  required = false,
  onChange,
  disabled = false
}: FormFieldProps) {
  const renderInput = () => {
    switch (type) {
      case 'text':
        return (
          <input
            type="text"
            name={name}
            value={value as string || ''}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="ff-input"
          />
        );

      case 'select':
        return (
          <select
            name={name}
            value={value as string || ''}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="ff-select"
          >
            <option value="">{placeholder || 'Select an option'}</option>
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        );

      case 'radio':
        return (
          <div className="ff-radio-group">
            {options.map((opt) => (
              <label key={opt.value} className="ff-radio-label">
                <input
                  type="radio"
                  name={name}
                  value={opt.value}
                  checked={value === opt.value}
                  onChange={(e) => onChange?.(e.target.value)}
                  disabled={disabled}
                />
                <span className="ff-radio-custom"></span>
                <span className="ff-radio-text">{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'date':
        const dateValue = (value as string) || '';
        const [year, month, day] = dateValue.split('-');
        return (
          <div className="ff-date-group">
            <input
              type="text"
              name={`${name}_year`}
              value={year || ''}
              placeholder="YYYY"
              maxLength={4}
              onChange={(e) => {
                const newYear = e.target.value.replace(/\D/g, '').slice(0, 4);
                const newDate = `${newYear}-${month || ''}-${day || ''}`.replace(/-+$/, '');
                onChange?.(newDate);
              }}
              disabled={disabled}
              className="ff-date-input"
            />
            <span className="ff-date-sep">/</span>
            <select
              name={`${name}_month`}
              value={month || ''}
              onChange={(e) => onChange?.(`${year || ''}-${e.target.value}-${day || ''}`.replace(/-+$/, ''))}
              disabled={disabled}
              className="ff-date-select"
            >
              <option value="">Month</option>
              {Array.from({ length: 12 }, (_, i) => {
                const m = String(i + 1).padStart(2, '0');
                return <option key={m} value={m}>{m}</option>;
              })}
            </select>
            <span className="ff-date-sep">/</span>
            <select
              name={`${name}_day`}
              value={day || ''}
              onChange={(e) => onChange?.(`${year || ''}-${month || ''}-${e.target.value}`.replace(/-+$/, ''))}
              disabled={disabled}
              className="ff-date-select"
            >
              <option value="">Day</option>
              {Array.from({ length: 31 }, (_, i) => {
                const d = String(i + 1).padStart(2, '0');
                return <option key={d} value={d}>{d}</option>;
              })}
            </select>
          </div>
        );

      case 'checkbox':
        return (
          <label className="ff-checkbox-label">
            <input
              type="checkbox"
              name={name}
              checked={value as boolean || false}
              onChange={(e) => onChange?.(e.target.checked)}
              disabled={disabled}
              className="ff-checkbox-input"
            />
            <span className="ff-checkbox-custom"></span>
            <span className="ff-checkbox-text">{placeholder}</span>
          </label>
        );

      case 'textarea':
        return (
          <textarea
            name={name}
            value={value as string || ''}
            placeholder={placeholder}
            onChange={(e) => onChange?.(e.target.value)}
            disabled={disabled}
            className="ff-textarea"
            rows={4}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className={`form-field ff-type-${type}`}>
      {label && type !== 'checkbox' && (
        <label className="ff-label">
          {label}
          {required && <span className="ff-required">*</span>}
        </label>
      )}
      {renderInput()}
    </div>
  );
}

export default FormField;