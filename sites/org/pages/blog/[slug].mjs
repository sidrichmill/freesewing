import { order } from 'site/prebuild/blog-paths.mjs'
import { getPostSlugPaths } from 'site/components/mdx/posts/utils.mjs'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useDynamicMdx } from 'shared/hooks/use-dynamic-mdx.mjs'
import { useCallback } from 'react'
import { PostLayout, ns as layoutNs } from 'site/components/layouts/post.mjs'
import { PostArticle, ns as postNs } from 'site/components/mdx/posts/article.mjs'
import { PageWrapper, ns as pageNs } from 'shared/components/wrappers/page.mjs'

const namespaces = [...layoutNs, ...postNs, ...pageNs]

/*
 * Each page MUST be wrapped in the PageWrapper component.
 * You also MUST spread props.page into this wrapper component
 * when path and locale come from static props (as here)
 * or set them manually.
 */
const BlogPage = ({ locale, slug, page }) => {
  // function to load the correct markdown
  const loader = useCallback(() => import(`orgmarkdown/blog/${slug}/${locale}.md`), [slug, locale])
  // load the markdown
  const { frontmatter, MDX } = useDynamicMdx(loader)

  return (
    <PageWrapper
      {...page}
      locale={locale}
      title={frontmatter.title}
      layout={(props) => <PostLayout {...props} {...{ slug: page.path.join('/'), frontmatter }} />}
    >
      <PostArticle
        {...{
          slug,
          frontmatter,
          MDX,
          page,
        }}
      />
    </PageWrapper>
  )
}

/*
 * getStaticProps() is used to fetch data at build-time.
 *
 * On this page, it passes the name of the bundle to be loaded on the client.
 *
 * This, in combination with getStaticPaths() below means this
 * page will be used to render/generate all blog content.
 *
 * To learn more, see: https://nextjs.org/docs/basic-features/data-fetching
 */
export async function getStaticProps({ params, locale }) {
  const { slug } = params

  // if the slug isn't present in the prebuilt order, return 404
  if (order[locale].indexOf(`blog/${slug}`) === -1) {
    return { notFound: true }
  }

  return {
    props: {
      slug,
      locale,
      ...(await serverSideTranslations(locale, namespaces)),
      page: {
        locale,
        path: ['blog', slug],
      },
    },
  }
}

/*
 * getStaticPaths() is used to specify for which routes (think URLs)
 * this page should be used to generate the result.
 *
 * On this page, it is returning a truncated list of routes (think URLs) for all
 * the mdx blog (markdown) content.
 * That list comes from prebuild/blog-paths.mjs, which is built in the prebuild step
 * and contains paths, titles, imageUrls, and intro for all blog posts.
 *
 * the fallback: 'blocking' property means that
 * any pages that haven't been pre-generated
 * will generate and cache the first time someone visits them
 *
 * To learn more, see: https://nextjs.org/docs/basic-features/data-fetching
 */
export const getStaticPaths = async () => {
  return {
    paths: getPostSlugPaths(order),
    fallback: 'blocking',
  }
}

export default BlogPage
