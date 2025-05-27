import { useState } from "react";
import { Comment } from "@/lib/client/types/types";
import { formatDateTime, isValidUrl } from "@/lib/utils";
import Image from "next/image";
import { Star } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useTranslations } from "next-intl";
interface CommentsSectionProps {
  comments: Comment[];
}

export default function CommentsSection({ comments }: CommentsSectionProps) {
  const commentsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(comments.length / commentsPerPage);
  const startIndex = (currentPage - 1) * commentsPerPage;
  const paginatedComments = comments.slice(
    startIndex,
    startIndex + commentsPerPage
  );
  const t = useTranslations("RoomDetail");

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div>
      <h3 className="font-bold text-xl mb-4">{t("comments.title")}</h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-2 h-80 overflow-y-auto">
        {paginatedComments.map((comment: Comment, index: number) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center gap-3">
              <div>
                <Image
                  alt={t("comments.userAvatarAlt")}
                  className="w-12 h-12 rounded-full object-cover"
                  width={48}
                  height={48}
                  src={
                    isValidUrl(comment.avatar)
                      ? comment.avatar
                      : "/placeholder.svg"
                  }
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="uppercase font-bold text-sm">
                  {comment.tenNguoiBinhLuan}
                </span>
                {comment.saoBinhLuan > 0 && (
                  <span className="text-black font-bold flex gap-1">
                    {Array.from({ length: comment.saoBinhLuan }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 text-custom-rose" />
                    ))}
                  </span>
                )}
                <p className="text-gray-600 text-sm dark:text-white">
                  <time>{formatDateTime(comment.ngayBinhLuan)}</time>
                </p>
              </div>
            </div>
            <div>
              <p className="w-1/2 truncate">{comment.noiDung}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 mb-4">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
                className="cursor-pointer hover:bg-rose-100 hover:text-rose-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-white"
              />
            </PaginationItem>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <PaginationItem key={page}>
                <PaginationLink
                  onClick={() => handlePageChange(page)}
                  isActive={currentPage === page}
                  className={`cursor-pointer hover:bg-rose-100 hover:text-rose-600 transition-colors ${
                    currentPage === page
                      ? "bg-rose-500 text-white hover:bg-rose-600 hover:text-white"
                      : ""
                  }`}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
                className="cursor-pointer hover:bg-rose-100 hover:text-rose-600 transition-colors dark:hover:bg-gray-800 dark:hover:text-white"
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
