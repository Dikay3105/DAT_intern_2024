import React, { useRef, useState } from 'react';
import './Table.scss';
import { IoMdClose } from 'react-icons/io';
import { IoIosArrowDown } from "react-icons/io";
import { Tooltip } from 'react-tooltip'
import InputColor from 'react-input-color';
// import { SketchPicker } from 'react-color';
import { Rnd } from "react-rnd";

const Table = () => {
    const [data, setData] = useState([
        { id: 1, no: 1, name: 'Alice', age: 25, country: 'USA' },
        { id: 2, no: 2, name: 'Bob', age: 30, country: 'UK' },
        { id: 3, no: 3, name: 'Charlie', age: 28, country: 'Canada' },
    ]);
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [isNearBottom, setIsNearBottom] = useState(false);
    const [openPopupColumn, setOpenPopupColumn] = useState(false);
    const [editingCell, setEditingCell] = useState({ rowIndex: null, field: null });
    const [newValue, setNewValue] = useState('');
    const [addCount, setAddCount] = useState(1);
    const [columns, setColumns] = useState(["NO", "Name", "Age", "Country"]);
    const [newColumn, setNewColumn] = useState('');
    const [selectedColumnIndex, setSelectedColumnIndex] = useState(null);
    const [columnWidths, setColumnWidths] = useState(columns.map(() => '')); // Chỉnh width cột
    const [rowHeights, setRowHeights] = useState(data.map(() => '')); // Chỉnh height hàng
    const [columnBackgroundColors, setColumnBackgroundColors] = useState(columns.map(() => ''));
    const [newColumnWidth, setNewColumnWidth] = useState('200');
    const [newRowHeight, setNewRowHeight] = useState('100')
    const [openDropdowns, setOpenDropdowns] = useState([]);
    const [selectedRow, setSelectedRow] = useState(null);
    const [selectedColor, setSelectedColor] = useState('#fffff'); // Màu mặc định
    const [selectedFont, setSelectedFont] = useState('Roboto');
    const [fontSize, setFontSize] = useState(16); // Kích thước mặc định
    const [selectedColorOddRow, setSelectedColorOddRow] = useState('rgb(0,0,0,0)');
    const [selectedColorEvenRow, setSelectedColorEvenRow] = useState('rgb(0,0,0,0)');

    const [tableSetting, setTableSetting] = useState({
        width: 800,
        height: 600,
        backgroundColor: '#ffffff',
        borderWidth: 2,
        borderStyle: 'solid',
        borderColor: '#ccc',
        inlineBorderWidth: 2,
        inlineBorderStyle: 'solid',
        inlineBorderColor: '#ccc',
        headerColor: '#f2f2f2',
        color: '#000000',
    });
    const [heightInputValue, setHeightInputValue] = useState(tableSetting.height);
    const [widthInputValue, setWidthInputValue] = useState(tableSetting.width);
    const bordeWidthInputRef = useRef(tableSetting.borderWidth);
    const inlineBordeWidthInputRef = useRef(tableSetting.inlineBorderWidth);


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

    const updateRowHeight = (rowIndex, height) => {
        const updatedHeights = [...rowHeights];
        updatedHeights[rowIndex] = `${height}px`;
        setRowHeights(updatedHeights);
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


    //------------Change font size function
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
    //--------------------------------------

    //------------Change width function
    const increaseWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            width: prevSetting.width + 2
        }));
        setWidthInputValue(prevWidth => prevWidth + 2);
    };

    const decreaseWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            width: Math.max(prevSetting.width - 2, 200)
        }));
        setWidthInputValue(prevWidth => Math.max(prevWidth - 2, 200));
    };

    const handleWidthInputChange = (e) => {
        setWidthInputValue(Number(e.target.value));
    };

    const handleWidthKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newWidth = Number(widthInputValue) || 200;
            setTableSetting(prevSetting => ({
                ...prevSetting,
                width: newWidth
            }));
        }
    };

    //--------------------------------------

    //------------Change height function
    const increaseHeight = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            height: prevSetting.height + 2
        }));
        setHeightInputValue(prevHeight => prevHeight + 2); // Cập nhật input
    };

    const decreaseHeight = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            height: Math.max(prevSetting.height - 2, 600)
        }));
        setHeightInputValue(prevHeight => Math.max(prevHeight - 2, 600)); // Cập nhật input
    };

    const handleHeightInputChange = (e) => {
        setHeightInputValue(Number(e.target.value)); // Cập nhật giá trị tạm thời khi nhập
    };

    const handleHeightKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newHeight = Number(heightInputValue) || 600; // Lấy giá trị hiện tại trong input
            setTableSetting(prevSetting => ({
                ...prevSetting,
                height: newHeight
            }));
        }
    };
    //--------------------------------------

    //------------Change outlineborder width function
    const increaseBorderWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            borderWidth: prevSetting.borderWidth + 1
        }));
        bordeWidthInputRef.current = tableSetting.borderWidth + 1;
    };

    const decreaseBorderWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            borderWidth: Math.max(prevSetting.borderWidth - 1, 1)
        }));
        bordeWidthInputRef.current = tableSetting.borderWidth - 1;
    };

    const handleBorderWidthKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newHeight = Number(bordeWidthInputRef.current) || 0;
            setTableSetting(prevSetting => ({
                ...prevSetting,
                borderWidth: newHeight
            }));
        }
    };

    const handleBorderWidthInputChange = (e) => {
        bordeWidthInputRef.current = e.target.value;
    };
    //--------------------------------------

    //------------Change inlineborder width function
    const increaseInlineBorderWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            inlineBorderWidth: prevSetting.inlineBorderWidth + 1
        }));
        inlineBordeWidthInputRef.current = tableSetting.inlineBorderWidth + 1;
    };

    const decreaseInlineBorderWidth = () => {
        setTableSetting(prevSetting => ({
            ...prevSetting,
            inlineBorderWidth: Math.max(prevSetting.inlineBorderWidth - 1, 1)
        }));
        inlineBordeWidthInputRef.current = tableSetting.inlineBorderWidth - 1;
    };

    const handleInlineBorderWidthKeyPress = (e) => {
        if (e.key === 'Enter') {
            const newHeight = Number(inlineBordeWidthInputRef.current) || 0;
            setTableSetting(prevSetting => ({
                ...prevSetting,
                inlineBorderWidth: newHeight
            }));
        }
    };

    const handleInlineBorderWidthInputChange = (e) => {
        inlineBordeWidthInputRef.current = e.target.value;
    };
    //--------------------------------------

    return (
        <>
            <button onClick={() => console.log(data)}>Check</button>
            <div className="table_gear" onClick={() => setIsPopupOpen(true)}>⚙️</div>
            <div className="table">
                <Rnd
                    style={{
                        fontFamily: selectedFont,
                        fontSize: `${fontSize}px`,
                        borderWidth: `${tableSetting.borderWidth}px`,
                        borderColor: tableSetting.borderColor,
                        borderStyle: tableSetting.borderStyle,
                        backgroundColor: tableSetting.backgroundColor,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                    }}
                    default={{
                        x: 0,
                        y: 0,
                        width: tableSetting.width,
                        height: tableSetting.height
                    }}
                    onResizeStop={() => {

                    }}
                >
                    <div className={`table_container`}
                        style={{
                            height: '100%',
                            width: '100%'
                        }}>
                        <div className={`table_container_header`} >
                            {columns.map((value, key) => (
                                <div className="table_container_header_cell" key={key}
                                    style={{
                                        width: columnWidths[key],
                                        flex: columnWidths[key] ? 'none' : '1 1',
                                        backgroundColor: columnBackgroundColors[key],
                                        borderBottomWidth: `${tableSetting.inlineBorderWidth}px`,
                                        borderBottomColor: tableSetting.inlineBorderColor,
                                        borderBottomStyle: tableSetting.inlineBorderStyle,
                                        backgroundColor: tableSetting.headerColor
                                    }}
                                >
                                    {value}

                                </div>
                            ))}
                            {/* <div className="table_container_header_cell"
                            style={{
                                width: '30px',
                            }}>

                        </div> */}
                        </div>
                        {data.map((person, index) => (
                            <div
                                className={`table_container_row vertical} ${isNearBottom === index ? 'show-border' : ''}`}
                                style={{
                                    backgroundColor:
                                        (index + 1) % 2 === 0
                                            ? selectedColorEvenRow
                                            : selectedColorOddRow,
                                    height: rowHeights[index],
                                    flex: rowHeights[index] ? 'none' : '1 1',
                                }}
                                key={index}
                                onClick={(e) => handleClick(index, e)}  // Gọi handleClick khi click
                                onMouseMove={(e) => handleMouseMove(index, e)}  // Vẫn giữ sự kiện onMouseMove
                                onMouseLeave={() => setIsNearBottom(null)} // Reset khi mouse rời
                            >
                                {columns.map((column, colIndex) => (
                                    <div
                                        className={`table_container_row_cell`}
                                        style={{
                                            width: columnWidths[colIndex],
                                            flex: columnWidths[colIndex] ? 'none' : '1 1',
                                            backgroundColor: columnBackgroundColors[colIndex],
                                            borderBottomWidth: index === data.length - 1 ? '0px' : `${tableSetting.inlineBorderWidth}px`, // Kiểm tra nếu là dòng cuối
                                            borderBottomColor: tableSetting.inlineBorderColor,
                                            borderBottomStyle: tableSetting.inlineBorderStyle,
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

                                {/* <div className="table_container_row_cell">
                                <button className="btnDelRow" onClick={() => deleteData(index)} style={{ width: '30px' }}>
                                    <TiDelete size={'20px'} color="red" />
                                </button>
                            </div> */}
                            </div>
                        ))}


                        <Tooltip id="table_tooltip" />
                    </div>
                </Rnd>
                {
                    isPopupOpen && (
                        <>
                            <div className="table_overlay" onClick={togglePopup}></div>
                            <div className="table_popup">
                                <div className="table_popup_title">
                                    <h3>Settings</h3>
                                    <div className='table_popup_title_close' onClick={() => setIsPopupOpen(false)} style={{ cursor: "pointer" }}>
                                        <IoMdClose size={"20px"} />
                                    </div>
                                </div>
                                <div className="table_popup_main">
                                    <div className="table_popup_main_dropdown">
                                        <div className={`table_popup_main_dropdown_title ${openDropdowns.includes(0) ? 'active' : ''}`} onClick={() => toggleDropdown(0)}><h4>Table</h4><IoIosArrowDown /></div>
                                        <div className={`table_popup_main_dropdown_content ${openDropdowns.includes(0) ? 'active' : ''}`}>
                                            {/* <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
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
                                            </div> */}
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label style={{ marginRight: '10px' }}>Width:</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={decreaseWidth} style={{ margin: '0 10px', width: "40px" }}>-</button>
                                                    <input
                                                        type="number"
                                                        value={widthInputValue}
                                                        onChange={handleWidthInputChange}
                                                        onKeyDown={handleWidthKeyPress}
                                                        style={{ width: '80px', textAlign: 'center' }}
                                                        min="600"
                                                    />
                                                    <button onClick={increaseWidth} style={{ margin: '0 0 0 10px', width: "40px" }}>+</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label style={{ marginRight: '10px' }}>Height:</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={decreaseHeight} style={{ margin: '0 10px', width: "40px" }}>-</button>
                                                    <input
                                                        type="number"
                                                        value={heightInputValue}
                                                        onChange={handleHeightInputChange}
                                                        onKeyDown={handleHeightKeyPress}
                                                        style={{ width: '80px', textAlign: 'center' }}
                                                        min="600"
                                                    />
                                                    <button onClick={increaseHeight} style={{ margin: '0 0 0 10px', width: "40px" }}>+</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Background color:</label>
                                                <InputColor
                                                    initialValue={tableSetting.backgroundColor}
                                                    onChange={(color) => {
                                                        setTableSetting(prevSetting => ({
                                                            ...prevSetting,
                                                            backgroundColor: color.hex
                                                        }));
                                                    }}
                                                    placement="right"
                                                />
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Header color:</label>
                                                <InputColor
                                                    initialValue={tableSetting.headerColor}
                                                    onChange={(color) => {
                                                        setTableSetting(prevSetting => ({
                                                            ...prevSetting,
                                                            headerColor: color.hex
                                                        }));
                                                    }}
                                                    placement="right"
                                                />
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Font:
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
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label style={{ marginRight: '10px' }}>Font size:</label>
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
                                                <label>Font color:</label>
                                                <InputColor
                                                    initialValue={tableSetting.color}
                                                    onChange={(color) => setTableSetting(prevSetting => ({
                                                        ...prevSetting,
                                                        color: color.hex // Cập nhật thuộc tính color
                                                    }))}
                                                    placement="left"
                                                />
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label style={{ marginRight: '10px' }}>Outline border width:</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={decreaseBorderWidth} style={{ margin: '0 10px', width: "40px" }}>-</button>
                                                    <input
                                                        type="number"
                                                        value={bordeWidthInputRef.current}// Hiển thị giá trị width hiện tại
                                                        defaultValue={tableSetting.borderWidth}
                                                        onChange={handleBorderWidthInputChange} // Cập nhật width tạm thời vào widthInputRef
                                                        onKeyDown={handleBorderWidthKeyPress} // Chỉ cập nhật vào state khi nhấn Enter
                                                        style={{ width: '80px', textAlign: 'center' }}
                                                        min="8"
                                                    />
                                                    <button onClick={increaseBorderWidth} style={{ margin: '0 0 0 10px', width: "40px" }}>+</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label style={{ marginRight: '10px' }}>Inline border width:</label>
                                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                                    <button onClick={decreaseInlineBorderWidth} style={{ margin: '0 10px', width: "40px" }}>-</button>
                                                    <input
                                                        type="number"
                                                        value={inlineBordeWidthInputRef.current}// Hiển thị giá trị width hiện tại
                                                        defaultValue={tableSetting.inlineBorderWidth}
                                                        onChange={handleInlineBorderWidthInputChange} // Cập nhật width tạm thời vào widthInputRef
                                                        onKeyDown={handleInlineBorderWidthKeyPress} // Chỉ cập nhật vào state khi nhấn Enter
                                                        style={{ width: '80px', textAlign: 'center' }}
                                                        min="8"
                                                    />
                                                    <button onClick={increaseInlineBorderWidth} style={{ margin: '0 0 0 10px', width: "40px" }}>+</button>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Outline border style:
                                                <div className="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        className="table_popup_main_dropdown_content_item_change_select"
                                                        onChange={(e) => {
                                                            setTableSetting(prevSetting => ({
                                                                ...prevSetting,
                                                                borderStyle: e.target.value
                                                            }));
                                                        }}
                                                        value={tableSetting.borderStyle}
                                                    >
                                                        <option value="solid">Solid</option>
                                                        <option value="dashed">Dashed</option>
                                                        <option value="dotted">Dotted</option>
                                                        <option value="double">Double</option>
                                                        <option value="groove">Groove</option>
                                                        <option value="ridge">Ridge</option>
                                                        <option value="inset">Inset</option>
                                                        <option value="outset">Outset</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                Inline border style:
                                                <div className="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        className="table_popup_main_dropdown_content_item_change_select"
                                                        onChange={(e) => {
                                                            setTableSetting(prevSetting => ({
                                                                ...prevSetting,
                                                                inlineBorderStyle: e.target.value
                                                            }));
                                                        }}
                                                        value={tableSetting.inlineBorderStyle}
                                                    >
                                                        <option value="solid">Solid</option>
                                                        <option value="dashed">Dashed</option>
                                                        <option value="dotted">Dotted</option>
                                                        <option value="double">Double</option>
                                                        <option value="groove">Groove</option>
                                                        <option value="ridge">Ridge</option>
                                                        <option value="inset">Inset</option>
                                                        <option value="outset">Outset</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Outline border color:</label>
                                                <InputColor
                                                    initialValue={tableSetting.borderColor}
                                                    onChange={(color) => {
                                                        setTableSetting(prevSetting => ({
                                                            ...prevSetting,
                                                            borderColor: color.hex
                                                        }));
                                                    }}
                                                    placement="right"
                                                />
                                            </div>
                                            <div className="table_popup_main_dropdown_content_item" style={{ display: 'flex', alignItems: 'center' }}>
                                                <label>Inline border color:</label>
                                                <InputColor
                                                    initialValue={tableSetting.inlineBorderColor}
                                                    onChange={(color) => {
                                                        setTableSetting(prevSetting => ({
                                                            ...prevSetting,
                                                            inlineBorderColororderColor: color.hex
                                                        }));
                                                    }}
                                                    placement="right"
                                                />
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
                                                        <select className="table_popup_main_dropdown_content_item_change_select" onChange={(e) => setSelectedRow(parseInt(e.target.value))} value={selectedRow !== null ? selectedRow : -1}>
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

                                            <div className="table_popup_main_dropdown_content_item">
                                                <label>Choose row fix height</label>
                                                <div className="table_popup_main_dropdown_content_item_change">
                                                    <select
                                                        value={selectedRow !== null ? selectedRow : -1}
                                                        onChange={(e) => setSelectedRow(Number(e.target.value))}
                                                        className="table_popup_main_dropdown_content_item_change_select"
                                                    >
                                                        <option value={-1}>Chọn hàng</option>
                                                        {data.map((_, index) => (
                                                            <option key={index} value={index}>
                                                                Hàng {index + 1}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="table_popup_main_dropdown_content_item">
                                                {selectedRow !== null && (
                                                    <div className="table_popup_main_dropdown_content_item">
                                                        Chiều cao cho hàng {selectedRow + 1}:
                                                        <div className="table_popup_main_dropdown_content_item_inputGroup">
                                                            <input
                                                                type="number"
                                                                value={newRowHeight}
                                                                onChange={(e) => setNewRowHeight(e.target.value)}
                                                            />
                                                            <button onClick={() => updateRowHeight(selectedRow, newRowHeight)}>Lưu</button>
                                                        </div>
                                                    </div>
                                                )}
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
