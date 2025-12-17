import { useState } from 'react';
import { RNInput } from './RNInput';
import { RNTextarea } from './RNTextarea';
import { RNButton } from './RNButton';

export interface FormField {
    name: string;
    type: 'text' | 'email' | 'password' | 'textarea';
    label?: string;
    placeholder?: string;
    required?: boolean;
    validationRegex?: RegExp;
    errorMessage?: string;
    rows?: number; // for textarea
    className?: string;
}

export interface RNDynamicFormProps {
    fields: FormField[];
    onSubmit: (data: Record<string, string>) => void;
    submitLabel?: string;
    className?: string;
}

export function RNDynamicForm({ fields, onSubmit, submitLabel = 'Submit', className }: RNDynamicFormProps) {
    const [formData, setFormData] = useState<Record<string, string>>(() =>
        fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {})
    );

    const [errors, setErrors] = useState<Record<string, string>>({});

    const validateForm = () => {
        const newErrors: Record<string, string> = {};
        let isValid = true;

        fields.forEach((field) => {
            const value = formData[field.name]?.trim() || '';

            if (field.required && !value) {
                newErrors[field.name] = `${field.label || field.placeholder || field.name} is required`;
                isValid = false;
            } else if (field.validationRegex && !field.validationRegex.test(value)) {
                newErrors[field.name] = field.errorMessage || `Invalid ${field.label || field.name}`;
                isValid = false;
            }
        });

        setErrors(newErrors);
        return isValid;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
            setFormData(fields.reduce((acc, field) => ({ ...acc, [field.name]: '' }), {}));
            setErrors({});
        }
    };

    const handleChange = (name: string, value: string) => {
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors((prev) => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    };

    return (
        <form className={className} onSubmit={handleSubmit} noValidate>
            <div className="space-y-4">
                {fields.map((field) => (
                    <div key={field.name}>
                        {field.type === 'textarea' ? (
                            <RNTextarea
                                name={field.name}
                                label={field.label}
                                placeholder={field.placeholder}
                                rows={field.rows || 4}
                                className={field.className}
                                value={formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                error={errors[field.name]}
                            />
                        ) : (
                            <RNInput
                                name={field.name}
                                type={field.type}
                                label={field.label}
                                placeholder={field.placeholder}
                                className={field.className}
                                value={formData[field.name]}
                                onChange={(e) => handleChange(field.name, e.target.value)}
                                error={errors[field.name]}
                            />
                        )}
                    </div>
                ))}
                <RNButton size="lg" className="w-full" type="submit">
                    {submitLabel}
                </RNButton>
            </div>
        </form>
    );
}
