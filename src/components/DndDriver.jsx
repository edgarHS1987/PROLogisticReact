import { memo } from "react";
import { useDrag } from "react-dnd";

export const DndDriver = memo(function DndDriver({id, name, type}){
    const [{opacity,}, drag] = useDrag(
        ()=>({
            type,
            item: {id, name, type},
            collect: (monitor)=>({
                opacity: monitor.isDragging() ? 0.4 : 1
            })
        }), 
        [name, type]
    );

    return (
        <div ref={drag} style={{opacity}} data-testid="box">
            {name}
        </div>
    )
})