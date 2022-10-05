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
  todo: string;
};

const schema = baseValidationSchema.shape({
  todo: requiredString.min(3, "too short todo!").max(200, "too long todo!"),
});

export const CreateTodoForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: InitialValues = {
    todo: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addTodo(values.todo));
        resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex">
              <div className="flex flex-col">
                <Input name="todo" placeholder="New todo description" />
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
