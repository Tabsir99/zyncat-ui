// Ambient declaration so side-effect CSS imports (`import './x.css'`) typecheck.
// Each component imports its own stylesheet purely to link it into the JS module
// graph; tsup keeps `*.css` external, so the bare import survives into the shipped
// chunk and the consumer's bundler code-splits/lazy-loads the CSS with the component.
declare module '*.css';
