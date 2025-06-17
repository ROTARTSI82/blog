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
  return s.startsWith('/') ? `/granty29/dist${s}` : s;
}

export function BlogIndex(prop: any) {
  return <>
    <h3>Directory Contents</h3>
    <ul className="list-disc list-inside mt-2">
      {Object.keys(prop.post).map(x => [(('id' in prop.post[x]) ? '1' : '0')+x, x])
        .filter(l =>
          !prop.post[l[1]].data?.tags?.split(',')?.includes('hide-dir')
        ).sort().map(l =>
        <li>
          <code className="mr-2">{l[0][0]}</code>
          <a href={link(prop.isRoot ? `/blog/${l[1]}/` : `${l[1]}/`)}>{l[1]}</a>
        </li>
      )}
    </ul>
  </>
}