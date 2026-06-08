import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[100dvh] flex-col items-center justify-center px-6 text-center">
      <div
        className="mb-6 flex h-14 w-14 items-center justify-center rounded-full border border-[#242424]"
        style={{
          background: "#fff6df",
          boxShadow: "4px 4px 0 #cfdaf5",
          fontFamily: "var(--font-serif)",
          fontSize: "26px",
          fontWeight: 700,
        }}
        aria-hidden="true"
      >
        文
      </div>

      <p className="mb-3 flex items-center gap-[10px] font-mono text-[12px] uppercase tracking-[.06em] text-[#797776]">
        <span className="h-px w-8 bg-[#242424]" />
        Error 404
      </p>

      <h1 className="font-serif text-[clamp(40px,8vw,72px)] font-bold leading-[1] tracking-[-0.03em] text-[#242424]">
        404
      </h1>
      <p className="mt-4 max-w-[420px] text-[15px] leading-[1.7] text-[#4c4947]">
        页面不存在或已被移动。
        <br />
        <span className="text-[#797776]">This page doesn&apos;t exist or has moved.</span>
      </p>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link href="/zh" className="btn-v3-primary">返回首页</Link>
        <Link href="/zh/grammar" className="btn-v3-secondary">查看语法库</Link>
      </div>
    </main>
  );
}
