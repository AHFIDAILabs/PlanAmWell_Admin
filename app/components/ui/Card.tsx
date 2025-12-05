"use client";

import React, { FC, PropsWithChildren } from "react";

interface CardProps extends PropsWithChildren<{}> {
  className?: string;
}

export const Card: FC<CardProps> = ({ children, className }) => (
  <div className={`bg-white rounded-lg ${className}`}>{children}</div>
);

export const CardContent: FC<CardProps> = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
