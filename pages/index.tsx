import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { selectTodos } from "store/todos/slice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Formik, Form } from "formik";
import { Button } from "components/ui-kit/index";
import { Input } from "components/form/Input";

type InitialValues = {
  todo: string;
};

const CreateForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: InitialValues = {
    todo: "",
  };

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
      {() => {
        return (
          <Form>
            <div className="flex">
              <div className="flex flex-col mr-5">
                <Input name="todo" placeholder="todo" />
              </div>
              <Button>add</Button>
            </div>
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
      <div className="my-4">
        <Button onClick={() => fetchTodos()} className="mr-5">
          fetch todos
        </Button>
        <Button onClick={() => dispatch({ type: "todos/removeAll" })}>
          Remove all
        </Button>
      </div>
      <CreateForm />
      <DragDropContext
        onDragEnd={(result) => {
          if (result.destination) {
            dispatch({
              type: "todos/dragEnd",
              payload: {
                id: result.draggableId,
                destination: result.destination,
                source: result.source,
              },
            });
          }
        }}
      >
        <div className="flex">
          {Object.keys(todos).map((column, idx) => (
            <div className="flex flex-col" key={idx}>
              <div className="bg-gray-100 py-4 px-4">{column}</div>
              <Droppable droppableId={column}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps}>
                    {todos[column].map((todo, idx) => (
                      <Draggable
                        draggableId={todo.id}
                        key={todo.id}
                        index={idx}
                      >
                        {(provided) => {
                          return (
                            <div
                              key={todo.id}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="flex justify-between items-center mb-4 bg-white"
                            >
                              <div className="px-3">{todo.todo}</div>
                              <Button
                                onClick={() =>
                                  dispatch({
                                    type: "todos/remove",
                                    payload: { id: todo.id },
                                  })
                                }
                              >
                                Remove
                              </Button>
                            </div>
                          );
                        }}
                      </Draggable>
                    ))}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Root;
