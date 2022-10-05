import {
  Input as InputComponent,
  InputProps as InputComponentProps,
} from "components/shared/ui-kit/index";
import { useField, FieldAttributes } from "formik";

export const Input = ({
  name,
  ...props
}: FieldAttributes<InputComponentProps>) => {
  const [field, meta] = useField(name);

  return (
    <div className="mb-3">
      <InputComponent {...field} {...props} />
      {meta.touched && meta.error ? (
        <div className="text-red-500 text-sm mt-1">{meta.error}</div>
      ) : null}
    </div>
  );
};
