import {forwardRef, useRef, useEffect, useImperativeHandle} from 'react';

import { Row} from 'rsuite';
import Col from 'rsuite/Col';

import 'datatables.net-bs5/css/dataTables.bootstrap5.min.css';
import 'datatables.net-responsive-bs5/css/responsive.bootstrap5.min.css';
import jQuery from "jquery";
import jszip from 'jszip';
import pdfmake from 'pdfmake';
import DataTable from 'datatables.net-bs5';
import 'datatables.net-buttons-bs5';
import 'datatables.net-buttons/js/buttons.html5.mjs';
import DateTime from 'datatables.net-datetime';
import 'datatables.net-responsive-bs5';

import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Table = forwardRef(({
	columns,
	data,
	search,
	classes,
	loader
}, ref)=>{

	const table = useRef(null);

	const setTable = async ()=>{
		let columnsDef = columns.map((col, i)=>{
			let item = {
				width: col.width,
				target: i
			};

			return item;
		});

		new DataTable('#table',{
			dom:"<'row'<'col-sm-12 col-md-6 filter' f><'col-sm-12 col-md-6'B>>" +
        			"<'row'<'col-sm-12'tr>>" +
        		"<'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        	buttons:[],
        	oLanguage:{
				"sProcessing":"Procesando...",
				"sZeroRecords":"No se encontraron resultados",
				"sEmptyTable":"Ningún dato disponible en esta tabla",
				"sInfo":"Mostrando registros del _START_ al _END_ de un total de _TOTAL_ registros",
				"sInfoEmpty":"Mostrando registros del 0 al 0 de un total de 0 registros",
				"sInfoFiltered":"(filtrado de un total de _MAX_ registros)",
				"sInfoPostFix":"",
				"sSearch":"",
				"sSearchPlaceholder":"Filtrar",
				"sUrl":"",
				"sInfoThousands":",",
				"sLoadingRecords":"Cargando...",
				"oPaginate":{
					"sFirst":"Primero",
					"sLast":"Último",
					"sNext":"Siguiente",
					"sPrevious":"Anterior"
				},
				"fnInfoCallback":null,
			},
			paging:true,
			responsive:true,
			searching: search,
			//scrollY:"20em",
			//scrollX: true,
			autoWidth: true,
			info:false,
			ordering:false,
			columnDefs: [
                { responsivePriority: 0, targets: -1, width:'120px' },                
            ],
			pageLength:25
		}); 
	}

	const resetTable = async ()=>{
		await new DataTable('#table').destroy();		
	}

	useImperativeHandle(ref, ()=>({
		setTable,
		resetTable
	}));


	return(
		<Row>
			<Col xs={24}>
				<table id="table" width='100%' className={'table-hover '+classes} ref={table}>
					<thead>
						<tr>
							{columns.map((column, index)=>
								column.show && (
									<th key={index} style={{width:column.width}}>
										{column.label}
									</th>
								)
							)}
						</tr>
					</thead>
					<tbody>
						{data.map((d, index)=>
							<tr key={index}>
								{columns && (
									columns.map((column, j)=>
										column.show && (
											<td key={j}>
												{column.selector(d)}
											</td>
										)
									)
								)}
							</tr>
						)}
					</tbody>
				</table>
			</Col>
		</Row>
	);
});

export default Table;

Table.defaulProps = {
	search: true,
	classes: ''
};