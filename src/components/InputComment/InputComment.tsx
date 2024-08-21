import { Box, Button, Chip } from "@mui/material";
import { Dispatch, SetStateAction, useState, useCallback } from "react";
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css';

const quillModules = {
    toolbar: [
        ['bold', 'italic', 'underline'],
        ['image'],
    ],
};

const quillFormats = [
    'bold', 'italic', 'underline',
    'list', 'bullet', 'indent',
    'image',
];

interface InputCommentProps {
    userEmail: string | undefined;
    type?: string;
    hideReply?: Dispatch<SetStateAction<boolean>>;
    insertComment: (comment: string, commentId: number, parentUser?: string) => void;
    parentId?: number;
}

const InputComment = ({ userEmail, type, hideReply, insertComment, parentId = 0 }: InputCommentProps) => {
    const [inputText, setInputText] = useState<string>("");
    const [readOnly, setReadOnly] = useState<boolean>(false);

    const submitCommentHandler = useCallback(() => {
        if (inputText.trim()) {
            insertComment(inputText, parentId, type === "reply" ? userEmail : undefined);
            setInputText("");
        }
    }, [inputText, parentId, userEmail, insertComment, type]);

    const onEditorChangeHandler = useCallback((value: string, editor: ReactQuill.UnprivilegedEditor) => {
        if (editor.getLength() < 250) {
            setReadOnly(false);
            setInputText(value);
        } else {
            setReadOnly(true);
        }
    }, []);

    return (
        <Box
            sx={{
                borderRadius: "30px",
                border: "1px solid #d9d9d9",
                width: "90%",
            }}
        >
            {userEmail && (
                <div style={{ padding: "10px 20px", fontSize: "20px" }}>
                    Hi <Chip label={`@${userEmail}`} color="primary" />
                </div>
            )}
            <div style={{ padding: "10px 20px" }}>
                <ReactQuill
                    formats={quillFormats}
                    modules={quillModules}
                    theme="snow"
                    value={inputText}
                    readOnly={readOnly}
                    onChange={(value, _, __, editor: ReactQuill.UnprivilegedEditor) =>
                        onEditorChangeHandler(value, editor)
                    }
                />
                {readOnly && (
                    <p style={{ color: "red", margin: 0, float: "right" }}>
                        Maximum limit breached{" "}
                        <span
                            onClick={() => setReadOnly(false)}
                            style={{ color: "blue", cursor: "pointer" }}
                        >
                            Edit Again
                        </span>
                    </p>
                )}
                <Button
                    onClick={submitCommentHandler}
                    sx={{ marginTop: "15px", marginRight: "15px" }}
                    variant="contained"
                    disabled={!inputText.trim()} // Disable button if input is empty
                >
                    Send
                </Button>
                {type === "reply" && hideReply && (
                    <Button
                        onClick={() => hideReply(false)}
                        sx={{ marginTop: "15px" }}
                        variant="contained"
                    >
                        Cancel
                    </Button>
                )}
            </div>
        </Box>
    );
};

export default InputComment;
