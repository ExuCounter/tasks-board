import { useAppDispatch } from "store/index";
import { Formik, Form } from "formik";
import { Button } from "components/shared/ui-kit/index";
import { Input } from "components/shared/form/Input";
import {
  requiredString,
  baseValidationSchema,
} from "components/shared/utils/validate";
import { addTodosColumn } from "store/todo_board/reducers/columnsReducer";

type InitialValues = {
  title: string;
};

const schema = baseValidationSchema.shape({
  title: requiredString
    .min(3, "too short column name!")
    .max(20, "too long column name!"),
});

export const CreateColumnForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: InitialValues = {
    title: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={schema}
      onSubmit={(values, { resetForm }) => {
        dispatch(addTodosColumn({ title: values.title }));
        resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex">
              <div className="flex flex-col">
                <Input name="title" placeholder="New column title" />
              </div>
              <div>
                <Button type="submit">add</Button>
              </div>
            </div>
          </Form>
        );
      }}
    </Formik>
  );
};
