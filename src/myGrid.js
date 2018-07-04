import React from 'react';
import { Table, Icon, Divider } from 'antd';
import { DragSource, DropTarget } from 'react-dnd';

const Types = {
    ITEM: 'article'
};

const columns = [{
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
}, {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
}, {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
}];

class BodyRow extends React.Component {
    render() {
        const {
            isOver,
            connectDragSource,
            connectDropTarget,
            moveRow,
            dragRow,
            clientOffset,
            sourceClientOffset,
            initialClientOffset,
            ...restProps
        } = this.props;
        const style = { ...restProps.style, cursor: 'move' };

        let className = restProps.className;
        if (isOver && initialClientOffset) {
            className += ' drop-over-downward';
        }

        return connectDragSource(
            connectDropTarget(
                <tr
                    {...restProps}
                    className={className}
                    style={style}
                />
            )
        );
    }
}

const rowSource = {
    beginDrag(props) {
        return {
            index: props.index,
        };
    },
};

const rowTarget = {
    drop(props, monitor) {
        console.log(monitor.getItem());
        const dragIndex = monitor.getItem().index;
        const hoverIndex = props.index;

        // Don't replace items with themselves
        // if (dragIndex === hoverIndex) {
        //     return;
        // }

        // Time to actually perform the action
        props.moveRow(dragIndex, hoverIndex);

        // Note: we're mutating the monitor item here!
        // Generally it's better to avoid mutations,
        // but it's good here for the sake of performance
        // to avoid expensive index searches.
        monitor.getItem().index = hoverIndex;
    },
};

const DragableBodyRow = DropTarget(Types.ITEM, rowTarget, (connect, monitor) => ({
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    sourceClientOffset: monitor.getSourceClientOffset(),
}))(
    DragSource(Types.ITEM, rowSource, (connect, monitor) => ({
        connectDragSource: connect.dragSource(),
        dragRow: monitor.getItem(),
        clientOffset: monitor.getClientOffset(),
        initialClientOffset: monitor.getInitialClientOffset(),
    }))(BodyRow)
);


class MyGrid extends React.Component {
    state = {
        data: [{
            key: '1',
            name: 'John Brown',
            age: 32,
            address: 'New York No. 1 Lake Park',
        }, {
            key: '2',
            name: 'Jim Green',
            age: 42,
            address: 'London No. 1 Lake Park',
        }, {
            key: '3',
            name: 'Joe Black',
            age: 32,
            address: 'Sidney No. 1 Lake Park',
        }],
    }

    components = {
        body: {
            row: DragableBodyRow,
        },
    }

    moveRow = (dragIndex, hoverIndex) => {
        const { data } = this.state;
        const dragRow = data[dragIndex];

        this.setState(prevState => ({
            data: [...data, dragRow]
          }))
    }

    render() {
        return (
            <Table
                columns={columns}
                dataSource={this.state.data}
                components={this.components}
                onRow={(record, index) => ({
                    index,
                    moveRow: this.moveRow,
                })}
            />
        );
    }
}


export default MyGrid;