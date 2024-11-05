const LayoutWrapper = ({ children }) => {
  return (
    <main className="layout-wrapper">
      <aside className="sidebar"></aside>
      <section>
        <header></header>
        <section>{children}</section>
      </section>
    </main>
  );
};

export default LayoutWrapper;
