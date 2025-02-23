import {useEffect, useState} from "react";
import {getTemplates} from "../../../utils/api";
import TemplateList from "../../../components/test/TemplateList";

export default function Home() {
    const [templates, setTemplates] = useState([]);

    useEffect(() => {
        getTemplates().then((templates) => setTemplates(templates));
    }, []);

    return (
        <div>
            <TemplateList templates={templates}/>
        </div>
    );
}