import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { selectTodos } from "store/todos/slice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Formik, Form, Field } from "formik";

type InitialValues = {
  name: string;
};

const CreateForm = () => {
  const initialValues: InitialValues = {
    name: "",
  };
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors = {} as any;
        if (values.name.length === 0) errors.name = "name is empty";
        return errors;
      }}
      onSubmit={(values) => {
        dispatch({ type: "todos/add", payload: { name: values.name } });
      }}
    >
      {({ errors, touched }) => {
        return (
          <Form>
            <Field
              name="name"
              placeholder="name"
              className="rounded border py-1 px-3"
            />
            {errors.name && touched.name ? (
              <div style={{ color: "red" }}>{errors.name}</div>
            ) : null}
            <button type="submit" className="border py-1 px-3 rounded">
              add
            </button>
          </Form>
        );
      }}
    </Formik>
  );
};

const Root: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  return (
    <div className="px-8 text-xl">
      <DragDropContext
        onDragEnd={(result) => {
          if (result.destination) {
            dispatch({
              type: "todos/dragEnd",
              payload: {
                id: result.draggableId,
                index: result.destination.index,
              },
            });
          }
        }}
      >
        <CreateForm />
        <Droppable droppableId="droppable">
          {(provided) => (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              {todos.map((todo, idx) => (
                <Draggable draggableId={todo.id} key={todo.id} index={idx}>
                  {(provided) => {
                    return (
                      <div
                        key={todo.id}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="flex justify-between"
                      >
                        <div>{todo.name}</div>
                        <button
                          onClick={() =>
                            dispatch({
                              type: "todos/remove",
                              payload: { id: todo.id },
                            })
                          }
                        >
                          Remove
                        </button>
                      </div>
                    );
                  }}
                </Draggable>
              ))}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default Root;
