import { memo } from "react";
import { useDrop } from "react-dnd"
import { Col, Grid, IconButton } from "rsuite";
import CloseIcon from '@rsuite/icons/Close';

export const DndZone = memo(function DndZone({
    accept,
    lastDroppedItem,
    onDrop,
    name,
    onDelete,
}){
    const [{isOver, canDrop}, drop] = useDrop({
        accept,
        drop: onDrop,
        collect: (monitor)=>({
            isOver: monitor.isOver(),
            canDrop: monitor.canDrop()
        })
    });
    const isActive = isOver && canDrop;

    return (
        <Grid fluid ref={drop} data-testid="dndzone" className={isActive ? 'shadow' : ''} style={{height:80}}>            
            <h5>{name}</h5>
            
            {lastDroppedItem.map((last, i)=>
                <Col xs={24} key={i}>
                    <Col xs={20}>
                        <p>{last.name}</p>
                    </Col>
                    <Col xs={4}>
                        <IconButton icon={<CloseIcon />} size="xs" onClick={()=>onDelete(i)} />
                    </Col>
                </Col>
            )}
        </Grid>
    )
})