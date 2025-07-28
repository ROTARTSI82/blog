import {getCollection} from "astro:content";

export async function calcBlogIndex() {
  const posts = await getCollection('blog');
  let paths = {};
  let partials = new Set<string>();
  let fulls = new Set<string>();

  for (const post of posts) {
    fulls.add(post.id);
    let parts = post.id.split('/');
    let cur = "";
    let final = parts.pop() ?? "index"
    let cursor: any = paths;
    for (const part of parts) {
      if (!(part in cursor))
        cursor[part] = {};
      cursor = cursor[part];
      cur += part + '/';
      partials.add(cur.slice(0, -1));
    }

    cursor[final] = post;
  }

  return { partials, fulls, paths }
}

export function link(s: string) {
  return s.startsWith('/') ? `/granty29${s}` : s;
}

export function BlogIndex(prop: any) {
  let objects = Object.keys(prop.post)
    .filter(l =>
      !prop.post[l].data?.tags?.split(',')?.includes('hide-dir'));

  return <>
    <meta property="og:description" content={`Directory with ${objects.length} items.`} />
    <h3>Directory Contents</h3>

    <ul className="list-disc list-inside mt-2">
      {objects.sort().map(l =>
        <li key={l}>
          <code className="mr-2">{'id' in prop.post[l] ? 0 : Object.keys(prop.post[l]).length}</code>
          <a href={link(prop.isRoot ? `/blog/${l}/` : `${l}/`)}>{l}</a>
        </li>
      )}
    </ul>
  </>
}