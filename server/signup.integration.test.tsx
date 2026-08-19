import React from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

vi.mock("@/const", () => ({ startLogin: vi.fn() }));
vi.mock("wouter", () => ({
  Link: ({ href, children, ...props }: { href: string; children: React.ReactNode; [key: string]: unknown }) => <a href={href} {...props}>{children}</a>,
}));

import SignUp from "../client/src/pages/SignUp";

describe("/cadastre-se", () => {
  it("renders safe customer and advertiser registration paths", () => {
    const html = renderToStaticMarkup(<SignUp />);
    expect(html).toContain("Cadastre-se no Aluga Rodas");
    expect(html).toContain("Quero alugar");
    expect(html).toContain("Quero anunciar");
    expect(html).toContain("Continuar com Google");
    expect(html).toContain("Continuar com Apple");
    expect(html).not.toContain("Criar Admin");
    expect(html).toContain('href="/entrar"');
  });
});
