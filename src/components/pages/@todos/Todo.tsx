import { useAppDispatch } from "store/index";
import { Button } from "components/shared/ui-kit/index";
import classNames from "classnames";
import { TodoType } from "store/todos/types";
import { removeTodo } from "store/todos/slice";

export const Todo = ({
  todo,
  isDragging,
}: {
  todo: TodoType;
  isDragging: boolean;
}) => {
  const dispatch = useAppDispatch();

  return (
    <div
      className={classNames(
        "flex justify-between items-center mb-4 bg-white transition-colors",
        { "bg-cyan-50": isDragging }
      )}
    >
      <div className="px-3">{todo.todo}</div>
      <Button onClick={() => dispatch(removeTodo({ id: todo.id }))}>
        Remove
      </Button>
    </div>
  );
};
