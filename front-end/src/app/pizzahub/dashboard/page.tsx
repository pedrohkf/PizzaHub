"use client";
import React, { useState } from "react";

export default function Page() {
    const [mode, setMode] = useState<"login" | "register" | "initial">("initial");

    return (
        <div>Olá</div>
    )
}              