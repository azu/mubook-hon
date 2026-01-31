import { ReactNode } from "react";
import "./Loading.css";

export const Loading = ({ children }: { children: ReactNode }) => {
    // pure css loading
    return (
        <div className={"Loading"} role="status" aria-label="Loading">
            {children}
            <div className="LoadingIndicator" aria-hidden="true">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};
