import React, { useState } from 'react';
import './Table.scss';
import { IoMdClose } from 'react-icons/io';
import { IoIosArrowDown, IoIosAddCircleOutline } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { Tooltip } from 'react-tooltip'
import { MdOutlineMoreVert } from 'react-icons/md';

const Table = () => {
    const [data, setData] = useState([
        { id: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [typeShow, setTypeShow] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [addCount, setAddCount] = useState(1);
    const [columns, setColumns] = useState(["NO.", "Name", "Age", "Country"]);
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
    const [newColumnName, setNewColumnName] = useState('');
    const [columnWidths, setColumnWidths] = useState(columns.map(() => '200px')); // Kích thước mặc định
    const [columnBackgroundColors, setColumnBackgroundColors] = useState(columns.map(() => '')); // Kích thước mặc định
    const [selectedColumnForWidth, setSelectedColumnForWidth] = useState(null);
    const [newColumnWidth, setNewColumnWidth] = useState('200');
    const [columnToDelete, setColumnToDelete] = useState(null); // Cột muốn xóa
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(2);
    const [isNearBottom, setIsNearBottom] = useState(false);
    const [openPopupColumn, setOpenPopupColumn] = useState(false)


    const handleMouseMove = (index, e) => {
        const div = e.currentTarget;
        const rect = div.getBoundingClientRect();
        const mouseY = e.clientY;

        // Khoảng cách xác định khi hover gần border-bottom
        const threshold = 10;
        if (mouseY >= rect.bottom - threshold) {
            setIsNearBottom(index);
        } else {
            setIsNearBottom(null);
        }
    };

    const handleClick = (index, e) => {
        const div = e.currentTarget;
        const rect = div.getBoundingClientRect();
        const mouseY = e.clientY;

        // Khoảng cách xác định khi click gần border-bottom
        const threshold = 10; // Khoảng cách trigger khi click gần phần dưới (có thể điều chỉnh)
        if (mouseY >= rect.bottom - threshold) {
            setIsNearBottom(index); // Đánh dấu gần với bottom
            console.log(`Click gần khu vực trigger của item ${index + 1}`); // Trigger console log
            addRowDataIndex(index + 1);
        } else {
            setIsNearBottom(null); // Không gần nữa
        }
    };


    const toggleDropdown = (index) => {
        // Kiểm tra xem dropdown có đang mở hay không
        if (openDropdowns.includes(index)) {
            setOpenDropdowns(openDropdowns.filter(item => item !== index)); // Đóng dropdown
        } else {
            setOpenDropdowns([...openDropdowns, index]); // Mở dropdown
        }
    };

    const handleDoubleClick = (rowIndex, field, value) => {
        setEditingCell({ rowIndex, field });
        setNewValue(value);
    };

    const addColumn = () => {
        if (!newColumn.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        if (columns.map(column => column.toLowerCase()).includes(newColumn.toLowerCase())) {
            alert("Column already exists.");
            return;
        }

        setColumns([...columns, newColumn]);
        setColumnWidths([...columnWidths, '200px']); // Thêm kích thước mặc định cho cột mới

        const updatedData = data.map(row => ({
            ...row,
            [newColumn.toLowerCase()]: '',
        }));
        setData(updatedData);
        setNewColumn('');
        setIsPopupOpen(false);
    };

    const addRowData = () => {
        const newRows = Array.from({ length: addCount }, (_, i) => ({
            id: data.length + i + 1,
            name: '',
            age: '',
            country: '',
        }));

        if (data.length + newRows.length > 10) {
            alert("Cannot add more than 10 items.");
            return;
        }

        setData([...data, ...newRows]);
        setAddCount(1);
        setIsPopupOpen(false);
    };

    const addRowDataIndex = (index) => {
        const newRows = Array.from({ length: addCount }, (_, i) => ({
            id: data.length + i + 1,
            name: '',
            age: '',
            country: '',
        }));

        // Kiểm tra số lượng dòng sau khi thêm
        if (data.length + newRows.length > 50) {
            alert("Cannot add more than 10 items.");
            return;
        }

        // Thêm các dòng mới vào vị trí chỉ định
        const updatedData = [
            ...data.slice(0, index),  // Các phần tử trước index
            ...newRows,               // Các dòng mới
            ...data.slice(index),     // Các phần tử sau index
        ];

        setData(updatedData);
        setAddCount(1);
        setIsPopupOpen(false);
    };


    const deleteData = (index) => {
        if (data.length <= 2) {
            alert("Cannot delete smaller 2 item.");
            return;
        }

        const updatedData = data.filter((_, i) => i !== index);
        setData([...updatedData]); // Cập nhật lại dữ liệu trong state
        console.log(data)
    };

    const handleChange = (e) => {
        setNewValue(e.target.value);
    };

    const handleBlur = () => {
        if (editingCell.rowIndex !== null && editingCell.field) {
            const updatedData = [...data];
            updatedData[editingCell.rowIndex][editingCell.field] = newValue;
            setData(updatedData);
            setEditingCell({ rowIndex: null, field: null });
            setNewValue('');
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleBlur();
        }
    };

    const togglePopup = () => {
        setIsPopupOpen(!isPopupOpen);
    };

    const handlPopupColumn = () => {
        setOpenPopupColumn(!openPopupColumn)
    }

    const updateColumnName = (index) => {
        if (!newColumnName.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        const oldColumnName = columns[index];
        const updatedColumns = [...columns];
        updatedColumns[index] = newColumnName;
        setColumns(updatedColumns);

        const updatedData = data.map(row => {
            row[newColumnName.toLowerCase()] = row[oldColumnName.toLowerCase()];
            delete row[oldColumnName.toLowerCase()];
            return row;
        });

        setData(updatedData);
        setNewColumnName('');
        setSelectedColumnIndex(null);
    };

    const updateColumnWidth = (index, width) => {
        const updatedWidths = [...columnWidths];
        updatedWidths[index] = `${width}px`;
        setColumnWidths(updatedWidths);
        setSelectedColumnForWidth(null);
        setNewColumnWidth('200');
    };

    const updateColumnBackgroundColor = (index, backgroundColor) => {
        const updatedBackgroundColors = [...columnBackgroundColors];
        updatedBackgroundColors[index] = backgroundColor;
        setColumnBackgroundColors(updatedBackgroundColors);
        // setSelectedColumnForBackgroundColor(null);
        // setNewColumnBackgroundColor('white');
    };

    const deleteColumn = () => {
        // Kiểm tra nếu cột được chọn là "NO."
        if (columns.length <= 2) {
            alert("Cannot delete column smaller 2 column.");
            return;
        }

        if (columnToDelete !== null) {
            // Cập nhật cột sau khi xóa cột được chọn
            const updatedColumns = columns.filter((_, index) => index !== columnToDelete);
            setColumns(updatedColumns);

            // Tìm tên cột cần xóa và sử dụng để loại bỏ thuộc tính tương ứng từ mỗi đối tượng trong data
            const columnName = columns[columnToDelete].toLowerCase();
            const updatedData = data.map(item => {
                const { [columnName]: _, ...rest } = item;
                return rest;
            });
            setData(updatedData);

            // Đặt lại columnToDelete và đóng popup
            setColumnToDelete(null);
            setIsPopupOpen(false);

            // Để xem dữ liệu mới trong console sau khi cập nhật
            setTimeout(() => console.log(updatedData), 0);
        }
    };


    return (
        <>
            <div className="table_gear" onClick={() => setIsPopupOpen(true)}>⚙️</div>
            <div className="table">

                <div className={`table_container ${typeShow ? 'vertical' : ''}`}>
                    <div className={`table_container_header ${typeShow ? 'vertical' : ''}`} >
                        {columns.map((value, key) => (
                            <div className="table_container_header_cell" onClick={() => updateColumnBackgroundColor(key, 'green')} key={key} style={{ width: columnWidths[key], backgroundColor: columnBackgroundColors[key] }}>{value}
                                <div className="table_container_header_cell_icon" onClick={handlPopupColumn}><MdOutlineMoreVert /></div>
                            </div>
                        ))}
                        <div className="table_container_header_cell" style={{ width: typeShow ? '200px' : '30px' }}></div>
                    </div>
                    {data.map((person, index) => (
                        <div
                            className={`table_container_row ${typeShow ? 'vertical' : ''} ${isNearBottom === index ? 'show-border' : ''}`}
                            key={index}
                            onClick={(e) => handleClick(index, e)}  // Gọi handleClick khi click
                            onMouseMove={(e) => handleMouseMove(index, e)}  // Vẫn giữ sự kiện onMouseMove
                            onMouseLeave={() => setIsNearBottom(null)} // Reset khi mouse rời
                        >
                            <div className="table_container_row_cell" style={{ width: columnWidths[0], backgroundColor: columnBackgroundColors[0] }}>
                                {index + 1}
                            </div>

                            {columns.slice(1).map((column, colIndex) => (
                                <div
                                    className={`table_container_row_cell ${typeShow ? 'vertical' : ''}`}
                                    style={{ width: columnWidths[colIndex + 1], backgroundColor: columnBackgroundColors[colIndex + 1] }}
                                    onDoubleClick={() => handleDoubleClick(index, column.toLowerCase(), person[column.toLowerCase()] || '')}
                                    key={colIndex}
                                    data-tooltip-id='table_tooltip'
                                    data-tooltip-content={person[column.toLowerCase()] || ''}
                                    data-tooltip-place="bottom"
                                >
                                    {editingCell.rowIndex === index && editingCell.field === column.toLowerCase() ? (
                                        <input
                                            value={newValue}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            onKeyDown={handleKeyDown}
                                            autoFocus
                                        />
                                    ) : (
                                        person[column.toLowerCase()] || ''
                                    )}
                                </div>
                            ))}
                            <div className="table_container_row_cell">
                                <button className="btnDelRow" onClick={() => deleteData(index)} style={{ width: '30px' }}>
                                    <TiDelete size={'20px'} color="red" />
                                </button>
                            </div>
                        </div>
                    ))}

                    <Tooltip id="table_tooltip" />
                </div>
                {
                    isPopupOpen && (
                        <>
                            <div className="table_overlay" onClick={togglePopup}></div>
                            <div className="table_popup">
                                <div className="table_popup_title">
                                    <h3>Settings</h3>
                                    <div onClick={() => setIsPopupOpen(false)} style={{ cursor: "pointer" }}>
                                        <IoMdClose />
                                    </div>
                                </div>
                                <div className="table_popup_main">
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(0)}>Table<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(0) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Change direction:
                                                <div class="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        class="table_popup_main_dropdown_content_item_change_select"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setTypeShow(value === "option1");
                                                        }}>
                                                        <option value="option2">Vertical</option>
                                                        <option value="option1">Horitzontal</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(1)}>Row<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(1) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item" style={{ gap: '10px' }}>
                                                <label>
                                                    Number of rows to add:
                                                </label>
                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="10"
                                                    value={addCount}
                                                    onChange={(e) => setAddCount(Number(e.target.value))}
                                                />
                                                <button className="table_popup_add" onClick={addRowData}>Add    </button>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item">
                                                Chọn hàng để xóa:
                                                <select onChange={(e) => setSelectedRow(parseInt(e.target.value))} value={selectedRow || ''}>
                                                    <option value="">Chọn hàng</option>
                                                    {data.map((row, index) => (
                                                        <option key={row.id} value={index}>
                                                            {index + 1}
                                                        </option>
                                                    ))}
                                                </select>
                                                {selectedRow !== null && (
                                                    <button onClick={() => deleteData(selectedRow)}>Delete</button>
                                                )}
                                            </div>


                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }

                {
                    openPopupColumn && (
                        <>
                            <div className="table_overlay" onClick={handlPopupColumn}></div>
                            <div className="table_popup" style={{ height: "auto" }}>
                                <div className="table_popup_title">
                                    <h3>Settings Column</h3>
                                    <div onClick={() => setOpenPopupColumn(false)} style={{ cursor: "pointer" }}>
                                        <IoMdClose />
                                    </div>
                                </div>
                                <div className="table_popup_main">
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(0)}>Add Column<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(0) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item">
                                                <label>
                                                    New column name:
                                                </label>
                                                <input
                                                    type="text"
                                                    value={newColumn}
                                                    onChange={(e) => setNewColumn(e.target.value)}
                                                />
                                                <button className="table_popup_add" onClick={addColumn}>Add</button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(1)}>Change name Column<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(1) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item">
                                                Chọn cột đổi tên:
                                                <select
                                                    value={selectedColumnIndex}
                                                    onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                                    className="table_popup_main_dropdown_content_item_select"
                                                >
                                                    <option value={null}>-- Chọn cột --</option>
                                                    {columns.map((col, index) => (
                                                        <option key={index} value={index}>{col}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item">
                                                {selectedColumnIndex !== null && (
                                                    <>
                                                        New name for {columns[selectedColumnIndex]}:
                                                        <input
                                                            type="text"
                                                            value={newColumnName}
                                                            onChange={(e) => setNewColumnName(e.target.value)}
                                                        />
                                                        <button className="table_popup_update" onClick={() => updateColumnName(selectedColumnIndex)}>Save</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(3)}>Size Adjustment<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(3) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item">
                                                Chọn cột để chỉnh kích thước:
                                                <select
                                                    value={selectedColumnForWidth}
                                                    onChange={(e) => setSelectedColumnForWidth(Number(e.target.value))}
                                                    className="table_popup_main_dropdown_content_item_select"
                                                >
                                                    <option value={null}>-- Chọn cột --</option>
                                                    {columns.map((col, index) => (
                                                        <option key={index} value={index}>{col}</option>
                                                    ))}
                                                </select>

                                            </div>
                                            <div className="table_popup_main_dropdown_content_item">
                                                {selectedColumnForWidth !== null && (
                                                    <>
                                                        Width for {columns[selectedColumnForWidth]}:
                                                        <input
                                                            type="number"
                                                            value={newColumnWidth}
                                                            onChange={(e) => setNewColumnWidth(e.target.value)}
                                                        />
                                                        px
                                                        <button onClick={() => updateColumnWidth(selectedColumnForWidth, newColumnWidth)}>Save</button>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(4)}>Del Column<IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(4) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item">
                                                Chọn cột để xóa:
                                                <select
                                                    value={columnToDelete}
                                                    onChange={(e) => setColumnToDelete(Number(e.target.value))}
                                                    className="table_popup_main_dropdown_content_item_select"
                                                >
                                                    <option value={null}>-- Chọn cột --</option>
                                                    {columns.map((col, index) => (
                                                        <option key={index} value={index}>{col}</option>
                                                    ))}
                                                </select>
                                                {columnToDelete !== null && (
                                                    <button onClick={deleteColumn}>Delete</button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }
            </div >
        </>
    );
};

export default Table;
