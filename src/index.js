import React, { useEffect, useState } from "react"
import { Col, Row, Table, FormGroup, Button } from "reactstrap"

import jsPDF from "jspdf";
import "jspdf-autotable";

export const TableYellow = (props) => {

    const [data, setData] = useState([])
    const [allData, setAllData] = useState([])
    const [children] = useState(props.children)
    const [sums, setSums] = useState()
    const [buttonsExport, setButtonsExport] = useState(props.export)



    useEffect(() => {
        if (props.data.length > 0) {
            setData(props.data)
            setAllData(props.allData)
            setButtonsExport(props.export)
        }
    }, [props])

    function headers() {

        let list = []
        children.map((col) => {
            if (col.props.export === undefined || col.props.export === true) {
                list.push(col.props.label)
            }
        })

        return list
    }

    function body() {

        let _list = [];

        allData.map((item) => {
            let _array = []
            children.map((col, index) => {
                _array.push(tdEffect(col, item))
            })
            _list.push(_array)
        })

        console.log("sums:::", sums)
        return _list

    }

    function tdEffect(col, item) {
        if (col.props.value !== undefined) {

            if (typeof col.props.value === "function") {
                if (col.props.sum === true) {
                    setSums(sums + item[col.props.column])
                }
                return col.props.value(item)
            } else {

                return col.props.value
            }
        } else {
            return item[col.props.column]
        }
    }

    function exportPDF() {


        const unit = "pt"
        const size = "A4" // Use A1, A2, A3 or A4
        const orientation = "landscape" // portrait or landscape

        const marginLeft = 40;
        const doc = new jsPDF(orientation, unit, size)

        doc.setFontSize(15)

        const title = props.name
        const _headers = [headers()]
        const _body = body()

        let content = {
            startY: 50,
            head: _headers,
            body: _body,
        }

        doc.text(title, marginLeft, 40)
        doc.autoTable(content)
        doc.save(`${Math.floor(Math.random() * 65536)}-report.pdf`)

    }

    return (
        <>
            {buttonsExport && (
                <Row>
                    <Col md="5" lg="5" xs="12">
                        <FormGroup>
                            <Button
                                title="Exportar PDF"
                                type="button"
                                size="sm"
                                color="warning"
                                onClick={() => exportPDF()}
                            >
                                <i className="fa fa-file-pdf-o"></i> PDF
                            </Button>{" "}
                        </FormGroup>
                    </Col>
                </Row>
            )}

            <Table responsive striped hover>
                <thead>
                    <tr>
                        {children && children.length > 0 && children.map((item) => (
                            <th key={`th_props_item${item.props.label}`}>{item.props.label}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.map((item) => (
                        <tr key={`TableCollumn_${item.code || item.id}`}>
                            {children && children.length > 0 && children.map((col, index) => (
                                <TableColumn key={`TableCollumn_${index || col.id}`} item={item} col={col} index={index} />
                            ))}
                        </tr>
                    ))}
                </tbody>

            </Table>
        </>
    )

}

export const TableColumn = (props) => {

    const [item, setItem] = useState(props.item)
    const [col, setCol] = useState(props.col)
    const [index, setIndex] = useState(props.index)

    useEffect(() => {
        setItem(props.item)
        setCol(props.col)
        setIndex(props.index)
    }, [props])

    function tdEffect() {
        if (col.props.value !== undefined) {

            if (typeof col.props.value === "function") {
                return col.props.value(item)
            } else {

                return col.props.value
            }
        } else {
            return item[col.props.column]
        }
    }

    function tdStyle(style, col) {
        if (typeof style === "function") {
            return style(col)
        } else {
            return style
        }
    }


    return (
        <td
            style={col.props.style !== undefined ? tdStyle(col.props.style, item[col.props.column]) : {}}
            key={`key_type_${index}`} >
            {tdEffect()}
        </td>
    )

}

