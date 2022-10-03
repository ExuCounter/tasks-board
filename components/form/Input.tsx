import {
  Input as InputComponent,
  InputProps as InputComponentProps,
} from "components/ui-kit/index";
import { useField, FieldAttributes } from "formik";

export const Input = ({
  name,
  ...props
}: FieldAttributes<InputComponentProps>) => {
  const [field, meta] = useField(name);

  return (
    <>
      <InputComponent {...field} {...props} />
      {meta.touched && meta.error ? (
        <div style={{ color: "red" }}>{meta.error}</div>
      ) : null}
    </>
  );
};
