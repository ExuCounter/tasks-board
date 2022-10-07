import { useAppDispatch } from "store/index";
import { Button } from "components/shared/ui-kit/index";
import classNames from "classnames";
import { TodoType } from "store/todos/types";
import { removeTodo } from "store/todos/slice";
import { Text } from "components/shared/ui-kit/index";

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
        "flex justify-between items-center mb-4 bg-white transition-colors rounded-md",
        { "bg-cyan-50 border-2": isDragging }
      )}
    >
      <Text className="px-3">{todo.description}</Text>
      <Button onClick={() => dispatch(removeTodo({ id: todo.id }))}>X</Button>
    </div>
  );
};
