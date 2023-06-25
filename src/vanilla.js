import MarkJS from './lib/mark';

export default function Mark(ctx) {
  const instance = new MarkJS(ctx);
  this.mark = (sv, opt) => {
    instance.mark(sv, opt);
    return this;
  };
  this.unmark = (opt) => {
    instance.unmark(opt);
    return this;
  };
  return this;
}
