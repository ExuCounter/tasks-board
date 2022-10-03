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
            <div className="flex flex-col">
              <Input name="todo" placeholder="todo" />
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
      </DragDropContext>
    </div>
  );
};

export default Root;
