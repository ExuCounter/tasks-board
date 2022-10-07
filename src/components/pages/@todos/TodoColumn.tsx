import type { ColumnType } from "store/todos/types";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { Todo } from "components/pages/@todos/Todo";
import { Spinner, Button } from "components/shared/ui-kit/index";
import { removeTodosColumn } from "store/todos/slice";
import classNames from "classnames";
import { useAppDispatch } from "store";

export const TodoColumn = ({
  title,
  name,
  todos,
  meta,
}: ColumnType & { name: string }) => {
  const isRemovableColumn = meta.policy.removable;
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col w-[100%] bg-gray-100 rounded-md">
      <div
        className="pt-4 px-7 flex justify-between content-center
      h-[60px]"
      >
        <div>{`${title} (${todos.length})`}</div>
        {isRemovableColumn && (
          <Button onClick={() => dispatch(removeTodosColumn({ title }))}>
            X
          </Button>
        )}
      </div>
      <Droppable droppableId={name}>
        {(provided, snapshot) => {
          const isSameColumn =
            snapshot.draggingOverWith &&
            todos.map((todo) => todo.id).includes(snapshot.draggingOverWith);

          const [isDraggingOver, draggingOverClassNames] = [
            snapshot.isDraggingOver && !isSameColumn,
            "m-2 overflow-y-scroll p-4 transition-all h-[80vh]",
          ];

          return (
            <div
              ref={provided.innerRef}
              {...provided.droppableProps}
              className={classNames(
                "m-2 overflow-y-scroll p-4 transition-all h-[80vh]",
                {
                  [draggingOverClassNames]: isDraggingOver,
                }
              )}
            >
              {meta.isLoading && (
                <div className="flex justify-center">
                  <Spinner />
                </div>
              )}
              {!meta.isLoading &&
                todos.map((todo, idx) => (
                  <Draggable draggableId={todo.id} key={todo.id} index={idx}>
                    {(provided, snapshot) => {
                      return (
                        <div
                          key={todo.id}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <Todo todo={todo} isDragging={snapshot.isDragging} />
                        </div>
                      );
                    }}
                  </Draggable>
                ))}
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    </div>
  );
};
