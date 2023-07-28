import { ReactNode } from "react";
import "./Loading.css";

export const Loading = ({ children }: { children: ReactNode }) => {
    // pure css loading
    return (
        <div className={"Loading"}>
            {children}
            <div className="LoadingIndicator">
                <div></div>
                <div></div>
            </div>
        </div>
    );
};
