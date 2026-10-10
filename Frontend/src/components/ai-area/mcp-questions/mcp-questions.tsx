import { ChangeEvent, useId, useState } from "react";
import "./mcp-questions.css";
import { notify } from "../../../utils/notify";
import { mcpService } from "../../../services/mcp-service";
import { McpModel } from "../../../models/mcp-model";
import { Spinner } from "../../shared-area/spinner/spinner";
import { useTokenExpiration } from "../../../hooks/use-token-expiration";

export function McpQuestions() {

    const token = localStorage.getItem("token");
    useTokenExpiration(token);
    
    const [question, setQuestion] = useState<McpModel>({ question: "" });
    const [answer, setAnswer] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const textAreaId = useId();

    function handleChange(event: ChangeEvent<HTMLTextAreaElement>): void {
        const question = event.target.value;
        setQuestion({ question });
    }

    async function send(): Promise<void> {
        try {
            setIsLoading(true);
            const answer = await mcpService.getMcpAnswer(question);
            setAnswer(answer);
        }
        catch(err: any) {
            notify.error(err);
        }
        finally {
            setIsLoading(false);
        }
    }
    
    return (
        <div className="McpQuestions">

            <h3>Ask me anything about our vacations</h3>

            <label htmlFor={textAreaId}>Question: </label>
            <textarea id={textAreaId} onChange={handleChange}></textarea>

            <button onClick={send}>Ask</button>
            <br />
            <hr />
            {isLoading && <Spinner />}
            {answer}
        </div>
    );
}
