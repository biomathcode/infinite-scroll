import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useStore, Data } from '../store/store'
import styles from '../styles/Home.module.css'

import useInfiniteScroll from 'react-infinite-scroll-hook';

import {Toaster, toast} from 'react-hot-toast';

import {subscribeWithSelector} from 'zustand/middleware'


declare var process : {
  env: {
    API_KEY: string
  }
}






const Home: NextPage = () => {
  const {users, fetchmore, initialFetch} = useStore();
  const [page, setPage] = useState(0);

  const [limit, setLimit] = useState(10);

  const [error, setError] = useState(true);

  const [loading, setLoading] = useState(false);

  const [hasNextPage, setHasNextPage] = useState(false);


  useEffect(() => {
   initialFetch('https://dummyapi.io/data/v1/user?page=0&limit=10')
  
   setHasNextPage(true);
   setError(false);
  }, [])

  


  const fetchData = () => {

    setHasNextPage(true);

    if(page === 10) {
      return  setHasNextPage(false);
    }
  

    console.log(
      'i got acivated'
    )
    setLoading(true)
    setPage(page + 1);

    fetchmore('https://dummyapi.io/data/v1/user', page, limit, users,process.env.API_KEY)
    setLoading(false);

  
    return 
  }


  const [sentryRef] = useInfiniteScroll({
    loading,
    hasNextPage,
    onLoadMore: fetchData ,
    // When there is an error, we stop infinite loading.
    // It can be reactivated by setting "error" state as undefined.
    disabled: !!error,
    delayInMs:500,
    // `rootMargin` is passed to `IntersectionObserver`.
    // We can use it to trigger 'onLoadMore' when the sentry comes near to become
    // visible, instead of becoming fully visible on the screen.
    rootMargin: '0px 0px 400px 0px',
  });


  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Toaster/>

      <main className={styles.main}>
        <div >{page}</div>
        { users && users.map((el:Data, i ) => (
          <div key={i} className="card" >
            <p>{el.title.toUpperCase() + " " +el.firstName + " "  + el.lastName }</p>
            <img src={el.picture} width="50px" height="50px" alt={el.firstName}/>
          </div>
        ))}
         {(loading || hasNextPage) && (
          <div ref={sentryRef} className="loading">
            <img src='/spinner.svg' width={'50px'} height={'50px'} alt="loading" />
          </div>
        )}
        {error && <h1>Error happend</h1>}

      </main>

     
    </div>
  )
}

export default Home
