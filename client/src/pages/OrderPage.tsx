import { spotOnOrderUrl } from "../lib/ordering";

export function OrderPage() {
  return (
    <main>
      <section className="order-hero page-hero">
        <div className="page-hero-copy">
          <h1>
            Order <em>online.</em>
          </h1>
          <p>Choose your items and pay on SpotOn. Your order confirmation comes from SpotOn.</p>
          <a className="button button-navy mt-5" href={spotOnOrderUrl}>
            Order on SpotOn <span aria-hidden="true">↗</span>
          </a>
        </div>
        <div className="order-hero-image">
          <img src="/images/soup-flatbread.png" alt="Fresh flatbread served with warm tomato soup" />
        </div>
      </section>
    </main>
  );
}
