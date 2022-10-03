import type { NextPage } from "next";
import { useAppDispatch, useAppSelector } from "store/index";
import { selectTodos } from "store/todos/slice";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Formik, Form } from "formik";
import { Button } from "components/ui-kit/index";
import { Input } from "components/form/Input";
import * as Yup from "yup";
import { todosApi } from "store/todos/api";
import classNames from "classnames";
import { TodoType } from "store/todos/types";

type InitialValues = {
  todo: string;
};

const CreateTodoSchema = Yup.object().shape({
  todo: Yup.string()
    .min(3, "too short todo!")
    .max(200, "too long todo!")
    .required("can't be blank!"),
});

const CreateTodoForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: InitialValues = {
    todo: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateTodoSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch({ type: "todos/add", payload: { todo: values.todo } });
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

const CreateColumnSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "too short column name!")
    .max(15, "too long column name!")
    .required("can't be blank!"),
});

const CreateColumnForm = () => {
  const dispatch = useAppDispatch();

  const initialValues: { name: string } = {
    name: "",
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CreateColumnSchema}
      onSubmit={(values, { resetForm }) => {
        dispatch({ type: "todos/addColumn", payload: { name: values.name } });
        resetForm();
      }}
    >
      {() => {
        return (
          <Form>
            <div className="flex">
              <div className="flex flex-col">
                <Input name="name" placeholder="New column name" />
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

const TodoColumn = ({ name, todos }: { name: string; todos: TodoType[] }) => {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col w-[100%] bg-gray-100">
      <div className="py-4 px-4">{`${name} (${todos.length})`}</div>
      <Droppable droppableId={name}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="m-2"
          >
            {todos.map((todo, idx) => (
              <Draggable draggableId={todo.id} key={todo.id} index={idx}>
                {(provided, snapshot) => {
                  return (
                    <div
                      key={todo.id}
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={classNames(
                        "flex justify-between items-center mb-4 bg-white transition-colors",
                        { "bg-cyan-50": snapshot.isDragging }
                      )}
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
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};

const Root: NextPage = () => {
  const dispatch = useAppDispatch();
  const todos = useAppSelector(selectTodos);

  const fetchTodos = async () => {
    const { data } = await dispatch(todosApi.endpoints.getTodos.initiate(null));

    if (data) {
      dispatch({
        type: "todos/bulkAdd",
        payload: data,
      });
    }
  };

  return (
    <div className="px-8 text-xl">
      <div className="flex items-start justify-between my-5">
        <div className="flex gap-4">
          <CreateTodoForm />
          <CreateColumnForm />
        </div>
        <div className="flex">
          <Button onClick={() => fetchTodos()} className="mr-5">
            Fetch random todos
          </Button>
          <Button onClick={() => dispatch({ type: "todos/removeAll" })}>
            Remove all todos
          </Button>
        </div>
      </div>
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
        <div className="flex gap-4 mt-4">
          {Object.keys(todos).map((column, idx) => (
            <TodoColumn name={column} todos={todos[column]} key={idx} />
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

export default Root;
