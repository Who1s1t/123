import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { Tooltip } from "@mui/material";
import CakeIcon from "@mui/icons-material/Cake";

const eventsData = {
    "2025-03-10": 5,
    "2025-03-15": 1,
    "2025-03-20": 3,
};

const birthdays = {
    "2025-03-05": ["Иванов И.И."],
    "2025-03-15": ["Петров П.П.", "Сидоров С.С."],
};

const productionDays = [6, 0]; // Суббота и воскресенье

const CustomCalendar = () => {
    const [date, setDate] = useState(new Date());

    const tileContent = ({ date }) => {
        const dateString = date.toISOString().split("T")[0];
        const isBirthday = birthdays[dateString];
        const eventCount = eventsData[dateString] || 0;
        let bgColor = "";

        if (eventCount >= 5) bgColor = "#FC4343";
        else if (eventCount < 2 && eventCount > 0) bgColor = "#89FC43";
        else if (eventCount === 0) bgColor = "#ffffff";
        else bgColor = "#F8FC43";

        return (
            <div style={{ backgroundColor: bgColor, width: "15px",height: "15px"}}>
                {isBirthday && (
                    <Tooltip title={isBirthday.join(", ")} arrow>
                        <CakeIcon style={{ fontSize: 18, marginLeft: 5 }} />
                    </Tooltip>
                )}
            </div>
        );
    };

    const tileClassName = ({ date }) => {
        const dayOfWeek = date.getDay();
        const today = new Date();
        const isToday = date.toDateString() === today.toDateString() ? "today" : "";
        const isWeekend = productionDays.includes(dayOfWeek) ? "weekend" : "";
        return `${isToday} ${isWeekend}`.trim();
    };

    return (
        <div>
            <Calendar
                onChange={setDate}
                value={date}
                tileContent={tileContent}
                tileClassName={tileClassName}
                locale="ru-RU"
            />
        </div>
    );
};

export default CustomCalendar;