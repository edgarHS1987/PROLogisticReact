import { forwardRef } from "react";
import { Col } from "rsuite";
import Table from "../../components/Table";

const ServicesTable = forwardRef(({
    loader,
    tableConfig,
    tableList,
    tableRef
}, ref)=>{
    return(
        <Col xs={24}>
            <div className='p-4 shadow rounded form-content'>
                <Table
                    loader={loader}
                    columns={tableConfig.columns}
                    data={tableList}
                    ref={tableRef}
                />
            </div>
        </Col>
    )
})

export default ServicesTable;