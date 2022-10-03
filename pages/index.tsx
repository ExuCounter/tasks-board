import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { selectTodos } from "store/todos/slice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Formik, Form, Field } from "formik";
import { Button } from "components/ui-kit/index";

type InitialValues = {
  todo: string;
};

const CreateForm = () => {
  const initialValues: InitialValues = {
    todo: "",
  };
  const dispatch = useAppDispatch();

  return (
    <Formik
      initialValues={initialValues}
      validate={(values) => {
        const errors = {} as any;
        if (values.todo.length === 0) errors.todo = "name is empty";
        return errors;
      }}
      onSubmit={(values) => {
        dispatch({ type: "todos/add", payload: { todo: values.todo } });
      }}
    >
      {({ errors, touched }) => {
        return (
          <Form>
            <div className="flex flex-col">
              <Field
                name="todo"
                placeholder="todo"
                className="rounded border py-1 px-3"
              />
              {errors.todo && touched.todo ? (
                <div style={{ color: "red" }}>{errors.todo}</div>
              ) : null}
            </div>
            <Button>add</Button>
          </Form>
        );
      }}
    </Formik>
  );
};

const Root: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const fetchTodos = async () => {
    const res = await fetch("/api/todos");
    const todos = await res.json();

    if (todos) {
      dispatch({
        type: "todos/bulkAdd",
        payload: todos,
      });
    }
  };

  return (
    <div className="px-8 text-xl">
      <Button onClick={() => fetchTodos()}>fetch todos</Button>
      <Button onClick={() => dispatch({ type: "todos/removeAll" })}>
        Remove all
      </Button>

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
                        <div>{todo.todo}</div>
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
