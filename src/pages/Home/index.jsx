import "./styles.css";
import { Component } from "react";

import { Posts } from "../../components/Posts";
import { loadPosts } from "../../utils/load-posts";
import { Button } from "../../components/Button/index";
import { TextInput } from "../../components/TextImput";

export class Home extends Component {
  state = {
    posts: [],
    allpost: [],
    page: 0,
    postsPerPage: 10,
    searchValue: "",
  };

  async componentDidMount() {
    await this.loadPosts();
  }

  loadPosts = async () => {
    // eslint-disable-next-line no-unused-vars
    const { page, postsPerPage } = this.state;
    const postsAndPhotos = await loadPosts();
    this.setState({
      posts: postsAndPhotos.slice(page, postsPerPage),
      allpost: postsAndPhotos,
    });
  };

  loadMorePosts = () => {
    const { page, postsPerPage, allpost, posts } = this.state;
    const nextPage = page + postsPerPage;
    const nextPosts = allpost.slice(nextPage, nextPage + postsPerPage);
    posts.push(...nextPosts);

    this.setState({ posts, page: nextPage });
  };

  handleChange = (e) => {
    const { value } = e.target;
    this.setState({ searchValue: value });
  };

  render() {
    const { posts, page, postsPerPage, allpost, searchValue } = this.state;
    const noMorePosts = page + postsPerPage >= allpost.length;
    const filteredPosts = !!searchValue
      ? allpost.filter((post) => {
          return post.title.toLowerCase().includes(searchValue.toLowerCase());
        })
      : posts;
    return (
      <section className="Container">
        <div className="search-container">
          {!!searchValue && <h1>Search Value: {searchValue}</h1>}
          <TextInput
            searchValue={searchValue}
            handleChange={this.handleChange}
          />
        </div>

        {filteredPosts.length > 0 && <Posts posts={filteredPosts} />}
        {filteredPosts.length === 0 && <p>Não existem posts</p>}

        <div className="button-container">
          {!searchValue && (
            <Button
              disabled={noMorePosts}
              text="Load more posts"
              onClick={this.loadMorePosts}
            />
          )}
        </div>
      </section>
    );
  }
}
