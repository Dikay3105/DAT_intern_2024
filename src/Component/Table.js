import React, { useState } from 'react';
import './Table.scss';
import { IoMdClose } from 'react-icons/io';
import { IoIosArrowDown } from "react-icons/io";
import { TiDelete } from "react-icons/ti";
import { Tooltip } from 'react-tooltip'
import { MdOutlineMoreVert } from 'react-icons/md';
import { HexColorPicker } from 'react-colorful';
import InputColor from 'react-input-color';
// import { SketchPicker } from 'react-color';

const Table = () => {
    const [data, setData] = useState([
        { id: 1, no: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, no: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, no: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [typeShow, setTypeShow] = useState(false);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(false);
    const [openPopupColumn, setOpenPopupColumn] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');
    const [addCount, setAddCount] = useState(1);
    const [columns, setColumns] = useState(["NO", "Name", "Age", "Country"]);
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
    const [columnWidths, setColumnWidths] = useState(columns.map(() => '200px')); // Kích thước mặc định
    const [columnBackgroundColors, setColumnBackgroundColors] = useState(columns.map(() => ''));
    const [newColumnWidth, setNewColumnWidth] = useState('200');
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#FFFFFF'); // Màu mặc định
    const [selectedFont, setSelectedFont] = useState('Roboto');
    const [fontSize, setFontSize] = useState(16); // Kích thước mặc định
    const [selectedColorOddRow, setSelectedColorOddRow] = useState('#FFFFFF');
    const [selectedColorEvenRow, setSelectedColorEvenRow] = useState('rgba(0, 0, 255, 0.336)');


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

    const handlPopupColumn = (columnIndex) => {
        setSelectedColumnIndex(columnIndex);
        setOpenPopupColumn(!openPopupColumn)
    }

    const updateColumnName = (index) => {
        if (!newColumn.trim()) {
            alert("Column name cannot be empty.");
            return;
        }

        const oldColumnName = columns[index];
        const updatedColumns = [...columns];
        updatedColumns[index] = newColumn;
        setColumns(updatedColumns);

        const updatedData = data.map(row => {
            row[newColumn.toLowerCase()] = row[oldColumnName.toLowerCase()];
            delete row[oldColumnName.toLowerCase()];
            return row;
        });

        setData(updatedData);
        setNewColumn('');
    };

    const updateColumnWidth = (index, width) => {
        const updatedWidths = [...columnWidths];
        updatedWidths[index] = `${width}px`;
        setColumnWidths(updatedWidths);
    };

    const updateColumnBackgroundColor = (index, backgroundColor) => {
        const updatedBackgroundColors = [...columnBackgroundColors];
        updatedBackgroundColors[index] = backgroundColor;
        setColumnBackgroundColors(updatedBackgroundColors);
    };

    const deleteColumn = () => {
        // Kiểm tra nếu cột được chọn là "NO."
        if (columns.length <= 2) {
            alert("Cannot delete column smaller 2 column.");
            return;
        }

        if (selectedColumnIndex !== null) {
            // Cập nhật cột sau khi xóa cột được chọn
            const updatedColumns = columns.filter((_, index) => index !== selectedColumnIndex);
            setColumns(updatedColumns);

            // Tìm tên cột cần xóa và sử dụng để loại bỏ thuộc tính tương ứng từ mỗi đối tượng trong data
            const columnName = columns[selectedColumnIndex].toLowerCase();
            const updatedData = data.map(item => {
                const { [columnName]: _, ...rest } = item;
                return rest;
            });
            setData(updatedData);

            const updatedBackgroundColors = columnBackgroundColors.filter((_, index) => index !== selectedColumnIndex);
            setColumnBackgroundColors(updatedBackgroundColors);
            const updatedColumnWidths = columnWidths.filter((_, index) => index !== selectedColumnIndex);
            setColumnWidths(updatedColumnWidths);


            // Đặt lại columnToDelete và đóng popup
            setSelectedColumnIndex(null);
            setOpenPopupColumn(false)

            // Để xem dữ liệu mới trong console sau khi cập nhật
            setTimeout(() => console.log(updatedData), 0);
        }
    };

    const increaseFontSize = () => {
        setFontSize(prevSize => prevSize + 2);
    };

    const decreaseFontSize = () => {
        setFontSize(prevSize => Math.max(prevSize - 2, 8));
    };
    const handleFontSizeChange = (e) => {
        const newFontSize = Number(e.target.value) || 0;
        setFontSize(newFontSize);
    };

    return (
        <>
            <div className="table_gear" onClick={() => setIsPopupOpen(true)}>⚙️</div>
            <div className="table">
                <div className={`table_container ${typeShow ? 'vertical' : ''}`} style={{ fontFamily: selectedFont, fontSize: `${fontSize}px` }}>
                    <div className={`table_container_header ${typeShow ? 'vertical' : ''}`} >
                        {columns.map((value, key) => (
                            <div className="table_container_header_cell" key={key} style={{ width: columnWidths[key], backgroundColor: columnBackgroundColors[key] }}>
                                {value}

                            </div>
                        ))}
                        <div className="table_container_header_cell" style={{ width: typeShow ? '200px' : '30px' }}></div>
                    </div>
                    {data.map((person, index) => (
                        <div
                            className={`table_container_row ${typeShow ? 'vertical' : ''} ${isNearBottom === index ? 'show-border' : ''}`}
                            style={{
                                backgroundColor:
                                    (index + 1) % 2 === 0
                                        ? selectedColorEvenRow
                                        : selectedColorOddRow

                            }}
                            key={index}
                            onClick={(e) => handleClick(index, e)}  // Gọi handleClick khi click
                            onMouseMove={(e) => handleMouseMove(index, e)}  // Vẫn giữ sự kiện onMouseMove
                            onMouseLeave={() => setIsNearBottom(null)} // Reset khi mouse rời
                        >
                            {/* <div className="table_container_row_cell" style={{ width: columnWidths[0], backgroundColor: columnBackgroundColors[0] }}>
                                {index + 1}
                            </div> */}

                            {columns.map((column, colIndex) => (
                                <div
                                    className={`table_container_row_cell ${typeShow ? 'vertical' : ''}`}
                                    style={{
                                        width: columnWidths[colIndex],
                                        backgroundColor: columnBackgroundColors[colIndex]
                                    }}
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
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(0)}><h4>Table</h4><IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(0) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Change direction:
                                                <div className="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        className="table_popup_main_dropdown_content_item_change_select"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            setTypeShow(value === "option1");
                                                        }}>
                                                        <option value="option2">Vertical</option>
                                                        <option value="option1">Horitzontal</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>

                                                <label style={{ marginRight: '10px' }}>Adjust Font Size:</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={decreaseFontSize} style={{ margin: '0 10px', width: "40px" }}>-</button>
                                                    <input
                                                        value={fontSize}
                                                        onChange={handleFontSizeChange}
                                                        style={{ width: '80px', textAlign: 'center' }}
                                                        min="8"
                                                    />

                                                    <button onClick={increaseFontSize} style={{ margin: '0 0 0 10px', width: "40px" }}>+</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Change font:
                                                <div className="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        className="table_popup_main_dropdown_content_item_change_select"
                                                        onChange={(e) => setSelectedFont(e.target.value)}
                                                        value={selectedFont}
                                                    >
                                                        <option value="Roboto">Roboto</option>
                                                        <option value="Arial">Arial</option>
                                                        <option value="Open Sans">Open Sans</option>
                                                        <option value="Verdana">Verdana</option>
                                                        <option value="Georgia">Georgia</option>
                                                        <option value="Tahoma">Tahoma</option>
                                                        <option value="Poppins">Poppins</option>
                                                        <option value="Merriweather">Merriweather</option>
                                                        <option value="Montserrat">Montserrat</option>

                                                    </select>
                                                </div>
                                            </div>



                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown">
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(1)}><h4>Row</h4><IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(1) ? 'active' : ''}`}>
                                            <div className="table_popup_main_dropdown_content_item" style={{ gap: '10px' }}>
                                                <label>
                                                    Number of rows to add:
                                                </label>
                                                <div className="table_popup_main_dropdown_content_item_inputGroup" >
                                                    <input
                                                        type="number"
                                                        min="1"
                                                        max="10"
                                                        value={addCount}
                                                        onChange={(e) => setAddCount(Number(e.target.value))}
                                                    />
                                                    <button className="table_popup_add" onClick={addRowData}>Add</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item">
                                                Choose row Del
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                    <div className="table_popup_main_dropdown_content_item_change">
                                                        <select className="table_popup_main_dropdown_content_item_change_select" onChange={(e) => setSelectedRow(parseInt(e.target.value))} value={selectedRow || ''}>
                                                            <option value="">Chọn hàng</option>
                                                            {data.map((row, index) => (
                                                                <option key={row.id} value={index}>
                                                                    {index + 1}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <button onClick={() => deleteData(selectedRow)}>Del</button>

                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown">
                                                <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(7)}>Change row diff color<IoIosArrowDown /></div>
                                                <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(7) ? 'active' : ''}`} >
                                                    <div className="table_popup_main_dropdown_content_item" style={{ justifyContent: 'normal' }}>
                                                        <label>Odd row:</label>
                                                        <InputColor
                                                            initialValue={selectedColorOddRow}
                                                            onChange={(color) => setSelectedColorOddRow(color.hex)}
                                                            placement="right"
                                                        />
                                                    </div>
                                                    <div className="table_popup_main_dropdown_content_item" style={{ justifyContent: 'normal' }}>
                                                        <label>Even row:</label>
                                                        <InputColor
                                                            initialValue={selectedColorEvenRow}
                                                            onChange={(color) => {
                                                                setSelectedColorEvenRow(color.hex)
                                                            }}
                                                            placement="right"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="table_popup_main_dropdown" >
                                        <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(2)}><h4>Column</h4><IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(2) ? 'active' : ''}`} >
                                            <div className="table_popup_main_dropdown_content_item">
                                                <label>
                                                    New column name:
                                                </label>
                                                <div className="table_popup_main_dropdown_content_item_inputGroup" >
                                                    <input
                                                        type="text"
                                                        value={newColumn}
                                                        onChange={(e) => setNewColumn(e.target.value)}
                                                    />
                                                    <button className="table_popup_add" onClick={addColumn}>Add</button>
                                                </div>
                                            </div>

                                            <div className="table_popup_main_dropdown">
                                                <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(7)}>Change color column<IoIosArrowDown /></div>
                                                <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(7) ? 'active' : ''}`} >
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Select Column
                                                        <div className="table_popup_main_dropdown_content_item_change">
                                                            <select
                                                                value={selectedColumnIndex}
                                                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                                                className="table_popup_main_dropdown_content_item_change_select"
                                                            >
                                                                <option value={-1}>Chọn cột</option>
                                                                {columns.map((col, index) => (
                                                                    <option key={index} value={index}>{col}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="table_popup_main_dropdown_content_item">

                                                        <InputColor
                                                            initialValue={selectedColor}
                                                            onChange={(color) => setSelectedColor(color.hex)}
                                                            placement="right"
                                                        />
                                                        <button onClick={() => {
                                                            updateColumnBackgroundColor(selectedColumnIndex, selectedColor);
                                                            setOpenPopupColumn(false); // Đóng popup sau khi xác nhận
                                                        }}>
                                                            Xác Nhận
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="table_popup_main_dropdown">
                                                <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(4)}>Change name Column<IoIosArrowDown /></div>
                                                <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(4) ? 'active' : ''}`}>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Select Column
                                                        <div className="table_popup_main_dropdown_content_item_change">
                                                            <select
                                                                value={selectedColumnIndex}
                                                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                                                className="table_popup_main_dropdown_content_item_change_select"
                                                            >
                                                                <option value={-1}>Chọn cột</option>
                                                                {columns.map((col, index) => (
                                                                    <option key={index} value={index}>{col}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        {selectedColumnIndex !== null && (
                                                            <>
                                                                New name for {columns[selectedColumnIndex]}:
                                                                <div className="table_popup_main_dropdown_content_item_inputGroup" >
                                                                    <input
                                                                        type="text"
                                                                        value={newColumn}
                                                                        onChange={(e) => setNewColumn(e.target.value)}
                                                                    />
                                                                    <button className="table_popup_update" onClick={() => updateColumnName(selectedColumnIndex)}>Save</button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="table_popup_main_dropdown">
                                                <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(5)}>Size Adjustment<IoIosArrowDown /></div>
                                                <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(5) ? 'active' : ''}`}>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Select Column
                                                        <div className="table_popup_main_dropdown_content_item_change">
                                                            <select
                                                                value={selectedColumnIndex}
                                                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                                                className="table_popup_main_dropdown_content_item_change_select"
                                                            >
                                                                <option value={-1}>Chọn cột</option>
                                                                {columns.map((col, index) => (
                                                                    <option key={index} value={index}>{col}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        {selectedColumnIndex !== null && (
                                                            <>
                                                                Width for {columns[selectedColumnIndex]}:
                                                                <div className="table_popup_main_dropdown_content_item_inputGroup" >
                                                                    <input
                                                                        type="number"
                                                                        value={newColumnWidth}
                                                                        onChange={(e) => setNewColumnWidth(e.target.value)}
                                                                    />
                                                                    <button onClick={() => updateColumnWidth(selectedColumnIndex, newColumnWidth)}>Save</button>
                                                                </div>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="table_popup_main_dropdown">
                                                <div className="table_popup_main_dropdown_title" onClick={() => toggleDropdown(6)}>Del Column<IoIosArrowDown /></div>
                                                <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(6) ? 'active' : ''}`}>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Select Column
                                                        <div className="table_popup_main_dropdown_content_item_change">
                                                            <select
                                                                value={selectedColumnIndex}
                                                                onChange={(e) => setSelectedColumnIndex(Number(e.target.value))}
                                                                className="table_popup_main_dropdown_content_item_change_select"
                                                            >
                                                                <option value={-1}>Chọn cột</option>
                                                                {columns.map((col, index) => (
                                                                    <option key={index} value={index}>{col}</option>
                                                                ))}
                                                            </select>
                                                        </div>
                                                    </div>
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Xóa cột:
                                                        <span style={{ marginLeft: '10px' }}>{columns[selectedColumnIndex]}</span>
                                                        {selectedColumnIndex !== null && (
                                                            <button onClick={deleteColumn}>Delete</button>
                                                        )}
                                                    </div>
                                                </div>
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
