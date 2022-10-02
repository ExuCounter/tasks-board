import type { NextPage } from "next";
import styles from "../styles/Home.module.css";
import { useAppDispatch, useAppSelector } from "store/index";
import { selectTodos } from "store/todos/slice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Formik, Form, Field } from "formik";

type InitialValues = {
  name: string;
};

const Root: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const initialValues: InitialValues = {
    name: "",
  };

  return (
    <div className={styles.container}>
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
                <Field name="name" placeholder="name" />
                {errors.name && touched.name ? (
                  <div style={{ color: "red" }}>{errors.name}</div>
                ) : null}
                <button type="submit">add</button>
              </Form>
            );
          }}
        </Formik>
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
