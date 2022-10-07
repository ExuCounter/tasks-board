import { useAppDispatch } from "store/index";
import { Formik, Form } from "formik";
import { Button } from "components/shared/ui-kit/index";
import { Input } from "components/shared/form/Input";
import {
  requiredString,
  baseValidationSchema,
} from "components/shared/utils/validate";
import { addTodo } from "store/todos/slice";

type InitialValues = {
  description: string;
};

const schema = baseValidationSchema.shape({
  description: requiredString
    .min(3, "too short todo!")
    .max(200, "too long todo!"),
});

export const CreateTodoForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: InitialValues = {
    description: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addTodo(values.description));
        resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex">
              <div className="flex flex-col">
                <Input name="description" placeholder="New todo description" />
              </div>
              <div>
                <Button>add</Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
